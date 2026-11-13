import { firebaseConfig } from './firebase-config.js';

/**
 * Ranking por edição + registro anônimo de respostas individuais.
 *
 * A primeira edição é "legado" para preservar o placar existente.
 * Após o reset autorizado, cada edição usa uma subcoleção própria.
 * Tentativas de TODAS as edições ficam em pet_grupo6_tentativas,
 * sem nome de participante, para permitir análise histórica.
 *
 * Todo resultado é salvo no tablet ANTES do envio ao Firebase.
 */
const LEGACY_COLLECTION = 'pet_grupo6_ranking';
const CONTROL_PATH = ['pet_grupo6_controle', 'placar'];
const ATTEMPTS_COLLECTION = 'pet_grupo6_tentativas';
const SESSION_KEY = 'pet-grupo6-edicao-atual-v1';
const LOCAL_KEY = 'pet-grupo6-ranking-local-v3';
const QUEUE_KEY = 'pet-grupo6-tentativas-pendentes-v3';
const OLD_LOCAL_KEY = 'pet-grupo6-ranking-local-v2';
const OLD_QUEUE_KEY = 'pet-grupo6-ranking-pending-v2';

const normalizeName = name => String(name || '').trim().replace(/\s+/g, ' ').slice(0, 28);
const validSession = id => typeof id === 'string' && /^(legado|ed-[a-zA-Z0-9_-]{12,60})$/.test(id);

export function rankEntries(entries) {
  const best = new Map();
  for (const row of entries) {
    if (!row || !Number.isFinite(row.score) || typeof row.name !== 'string') continue;
    const name = normalizeName(row.name);
    if (!name) continue;
    const normalized = { ...row, name, elapsedMs: Number(row.elapsedMs) || 0 };
    const key = name.toLocaleLowerCase('pt-BR');
    const prior = best.get(key);
    if (!prior || normalized.score > prior.score ||
      (normalized.score === prior.score && normalized.elapsedMs < prior.elapsedMs)) {
      best.set(key, normalized);
    }
  }
  return [...best.values()].sort((a, b) => b.score - a.score ||
    a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, 'pt-BR'));
}

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
function persist(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2, 15);
}
function getCachedSession() {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return validSession(value) ? value : 'legado';
  } catch { return 'legado'; }
}
function sessionCollection(db, api, sessionId) {
  return sessionId === 'legado'
    ? api.collection(db, LEGACY_COLLECTION)
    : api.collection(db, 'pet_grupo6_placares', sessionId, 'entradas');
}
function resultPayload(item, uid, api) {
  return {
    name: item.name,
    score: item.score,
    correct: item.correct,
    total: 10,
    elapsedMs: item.elapsedMs,
    questionSet: item.questionSet,
    submittedBy: uid,
    createdAt: api.serverTimestamp()
  };
}

/**
 * Retorno síncrono para que o quiz continue funcionando mesmo sem internet.
 * Os snapshots do Firebase atualizam a lista quando estiverem disponíveis.
 */
export function startLeaderboard({ config, onChange, onMode }) {
  let sessionId = getCachedSession();
  let local = readArray(LOCAL_KEY);
  let queue = readArray(QUEUE_KEY);
  let legacyLocal = readArray(OLD_LOCAL_KEY);
  let legacyQueue = readArray(OLD_QUEUE_KEY);
  let remote = [];
  let db = null;
  let auth = null;
  let api = null;
  let authenticated = false;
  let scoreServerLoaded = false;
  let lastError = '';
  let connecting = null;
  let syncJob = null;
  let unsubscribeScores = null;
  let unsubscribeControl = null;
  const hasFirebase = Boolean(firebaseConfig?.apiKey && firebaseConfig?.projectId);

  function localFor(session) {
    return local.filter(x => x.sessionId === session)
      .concat(session === 'legado' ? legacyLocal : []);
  }
  function pendingCount() { return queue.length + legacyQueue.length; }
  function mode() {
    if (!hasFirebase) return 'local';
    if (lastError) return 'erro';
    if (!authenticated) return 'conectando';
    if (!scoreServerLoaded || !navigator.onLine) return 'offline';
    return pendingCount() ? 'pendente' : 'online';
  }
  function emit() {
    onChange(rankEntries([...remote, ...localFor(sessionId)]), mode());
    onMode(mode(), pendingCount());
  }
  function saveQueue() {
    persist(LOCAL_KEY, local);
    persist(QUEUE_KEY, queue);
  }

  function subscribeScores() {
    unsubscribeScores?.();
    remote = [];
    scoreServerLoaded = false;
    emit();
    if (!authenticated || !db) return;
    const current = sessionId;
    const top = api.query(sessionCollection(db, api, current),
      api.orderBy('score', 'desc'), api.limit(100));
    unsubscribeScores = api.onSnapshot(top, { includeMetadataChanges: true }, snapshot => {
      if (current !== sessionId) return;
      remote = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      scoreServerLoaded = !snapshot.metadata.fromCache;
      lastError = '';
      emit();
      if (scoreServerLoaded) syncPending().catch(console.warn);
    }, error => {
      if (current !== sessionId) return;
      lastError = error?.code || String(error);
      scoreServerLoaded = false;
      console.error('Não foi possível consultar o ranking:', error);
      emit();
    });
  }

  function changeSession(next) {
    if (!validSession(next) || next === sessionId) return;
    sessionId = next;
    try { localStorage.setItem(SESSION_KEY, next); } catch { /* Armazenamento indisponível */ }
    subscribeScores();
  }

  function subscribeControl() {
    unsubscribeControl?.();
    unsubscribeControl = api.onSnapshot(
      api.doc(db, ...CONTROL_PATH),
      { includeMetadataChanges: true },
      snapshot => {
        // Se estiver offline sem cache, preserve o último ID conhecido no tablet.
        if (!snapshot.exists() && snapshot.metadata.fromCache) return;
        changeSession(snapshot.exists() ? snapshot.data().sessionId : 'legado');
      }, error => {
        console.warn('Não foi possível consultar a edição ativa:', error);
        // O quiz continua na última edição conhecida.
      }
    );
  }

  async function safeWrite(batch, verification) {
    try {
      await batch.commit();
      return;
    } catch (error) {
      // A confirmação pode se perder mesmo quando o servidor já gravou.
      // Somente considere confirmado se TODOS os documentos estiverem lá.
      try {
        const refs = verification.map(ref => api.getDocFromServer(ref));
        const found = await Promise.all(refs);
        if (found.every(snapshot => snapshot.exists())) return;
      } catch { /* Preserva erro original */ }
      throw error;
    }
  }

  async function syncPending() {
    if (!authenticated || !db || !api || !navigator.onLine) return;
    if (syncJob) return syncJob;
    syncJob = (async () => {
      // Também preserva pontuações pendentes das versões anteriores do quiz.
      while (legacyQueue.length) {
        const old = legacyQueue[0];
        try {
          const ref = api.doc(db, LEGACY_COLLECTION, old.id);
          const batch = api.writeBatch(db);
          batch.set(ref, resultPayload(old, auth.currentUser.uid, api));
          await safeWrite(batch, [ref]);
          legacyQueue = legacyQueue.filter(x => x.id !== old.id);
          persist(OLD_QUEUE_KEY, legacyQueue);
          emit();
        } catch (error) {
          console.warn('Pontuação antiga pendente:', error);
          break;
        }
      }
      while (queue.length) {
        const item = queue[0];
        const attemptRef = api.doc(db, ATTEMPTS_COLLECTION, item.id);
        const refs = [attemptRef];
        const batch = api.writeBatch(db);
        const analyticsRecord = {
          sessionId: item.sessionId,
          questionSet: item.questionSet,
          total: 10,
          correct: item.correct,
          answers: item.answers,
          submittedBy: auth.currentUser.uid,
          createdAt: api.serverTimestamp()
        };
        // Pontuações antigas ainda pendentes podem não ter idade.
        // Nesse caso, mantenha o registro para análise de erros sem inventar idade.
        if (Number.isInteger(item.age) && item.age >= 1 && item.age <= 120) {
          analyticsRecord.age = item.age;
        }
        batch.set(attemptRef, analyticsRecord);
        if (item.isNewBest) {
          const rankRef = api.doc(sessionCollection(db, api, item.sessionId), item.id);
          batch.set(rankRef, resultPayload(item, auth.currentUser.uid, api));
          refs.push(rankRef);
        }
        try {
          await safeWrite(batch, refs);
          queue = queue.filter(row => row.id !== item.id);
          persist(QUEUE_KEY, queue);
          lastError = '';
          emit();
        } catch (error) {
          lastError = error?.code || String(error);
          console.warn('Resultado aguardando sincronização:', error);
          emit();
          break;
        }
      }
    })().finally(() => { syncJob = null; });
    return syncJob;
  }

  async function connect() {
    if (!hasFirebase || connecting) return connecting;
    connecting = (async () => {
      try {
        const [
          { initializeApp, getApps, getApp },
          {
            getFirestore, collection, doc, query, orderBy, limit, onSnapshot,
            writeBatch, serverTimestamp, getDocFromServer
          },
          { getAuth, signInAnonymously }
        ] = await Promise.all([
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'),
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
        ]);
        const app = getApps().some(x => x.name === '[DEFAULT]')
          ? getApp() : initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        api = { collection, doc, query, orderBy, limit, onSnapshot, writeBatch, serverTimestamp, getDocFromServer };
        if (!auth.currentUser) await signInAnonymously(auth);
        authenticated = Boolean(auth.currentUser);
        lastError = '';
        subscribeControl();
        subscribeScores();
        syncPending().catch(console.warn);
        emit();
      } catch (error) {
        lastError = error?.code || String(error);
        console.warn('Firebase indisponível; mantendo o quiz local:', error);
        emit();
      }
    })().finally(() => { connecting = null; });
    return connecting;
  }

  const store = {
    get mode() { return mode(); },
    get sessionId() { return sessionId; },
    get pendingCount() { return pendingCount(); },
    refresh() { emit(); if (authenticated) syncPending().catch(console.warn); else connect(); },

    async save(result) {
      // A idade é voluntária. Se não for preenchida, não haverá média
      // atribuída a esta partida; suas respostas continuam no relatório.
      if (result.age != null &&
        (!Number.isInteger(result.age) || result.age < 1 || result.age > 120)) {
        throw new Error('Idade informada inválida.');
      }
      const sid = validSession(result.sessionId) ? result.sessionId : sessionId;
      if (!Array.isArray(result.answers) || result.answers.length !== 10 ||
        result.answers.some(a => typeof a.questionId !== 'string' ||
          typeof a.correct !== 'boolean' ||
          !Number.isInteger(a.elapsedMs) || a.elapsedMs < 0)) {
        throw new Error('A partida não contém 10 respostas válidas para o relatório.');
      }
      const row = {
        id: makeId(),
        sessionId: sid,
        name: normalizeName(result.name),
        age: result.age,
        score: Math.round(result.score),
        correct: Math.round(result.correct),
        total: 10,
        elapsedMs: Math.max(0, Math.round(result.elapsedMs)),
        questionSet: config.questionSetVersion,
        answers: result.answers.map(a => ({
          questionId: a.questionId,
          correct: a.correct,
          elapsedMs: a.elapsedMs
        })),
        savedAt: Date.now()
      };
      const previousBest = rankEntries([
        ...localFor(sid), ...(sid === sessionId ? remote : [])
      ]).find(entry => entry.name.toLocaleLowerCase('pt-BR') === row.name.toLocaleLowerCase('pt-BR'));
      row.isNewBest = !previousBest || row.score > previousBest.score ||
        (row.score === previousBest.score && row.elapsedMs < previousBest.elapsedMs);

      // TODAS as tentativas serão registradas para o relatório, mesmo com
      // pontuação menor do que a partida anterior desse mesmo participante.
      queue.push(row);
      if (row.isNewBest) {
        // A idade NÃO é armazenada ao lado do nome no ranking local.
        const { age, answers, ...publicScore } = row;
        local.push(publicScore);
      }
      try {
        saveQueue();
      } catch (error) {
        queue = queue.filter(x => x.id !== row.id);
        local = local.filter(x => x.id !== row.id);
        throw new Error('Não foi possível guardar os dados no tablet.');
      }
      emit();
      if (authenticated) syncPending().catch(console.warn);
      return { locallySaved: true, isNewBest: row.isNewBest, pending: pendingCount() > 0 };
    }
  };

  window.addEventListener('online', () => {
    scoreServerLoaded = false;
    if (!authenticated) connect(); else syncPending().catch(console.warn);
    emit();
  });
  window.addEventListener('offline', () => {
    scoreServerLoaded = false;
    emit();
  });
  window.addEventListener('storage', event => {
    if (![LOCAL_KEY, QUEUE_KEY, OLD_LOCAL_KEY, OLD_QUEUE_KEY, SESSION_KEY].includes(event.key)) return;
    local = readArray(LOCAL_KEY);
    queue = readArray(QUEUE_KEY);
    legacyLocal = readArray(OLD_LOCAL_KEY);
    legacyQueue = readArray(OLD_QUEUE_KEY);
    if (event.key === SESSION_KEY) changeSession(getCachedSession());
    emit();
  });

  emit();
  connect();
  return store;
}
