import { firebaseConfig } from './firebase-config.js';

/**
 * Ranking do PET Saúde — armazenamento local + sincronização Firestore.
 *
 * Cada partida terminada é guardada no tablet imediatamente e recebe um ID
 * estável. Se a internet cair, o envio é refeito automaticamente quando
 * voltar a conexão. setDoc com ID fixo evita envios duplicados.
 */
const LOCAL_KEY = 'pet-grupo6-ranking-local-v2';
const PENDING_KEY = 'pet-grupo6-ranking-pending-v2';
const COLLECTION = 'pet_grupo6_ranking';

const normalizeName = name => String(name || '').trim().replace(/\s+/g, ' ').slice(0, 28);

/** Retém a melhor partida por nome. Empate: menor tempo total. */
export function rankEntries(entries) {
  const byName = new Map();
  for (const row of entries) {
    if (!row || typeof row.name !== 'string' || !Number.isFinite(row.score)) continue;
    const name = normalizeName(row.name);
    if (!name || row.score < 0) continue;
    const entry = {
      ...row,
      name,
      elapsedMs: Number.isFinite(row.elapsedMs) ? row.elapsedMs : 0
    };
    const key = name.toLocaleLowerCase('pt-BR');
    const prior = byName.get(key);
    if (!prior || entry.score > prior.score ||
        (entry.score === prior.score && entry.elapsedMs < prior.elapsedMs)) {
      byName.set(key, entry);
    }
  }
  return [...byName.values()].sort((a,b) => b.score - a.score
    || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, 'pt-BR'));
}

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Armazenamento indisponível:', key, error);
    return [];
  }
}

function persistArray(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback caso a API de UUID não exista neste navegador.
  return String(Date.now()) + '-' + Math.random().toString(36).slice(2, 15);
}

export function startLeaderboard({ config, onChange, onMode }) {
  const hasConfig = firebaseConfig?.apiKey && firebaseConfig?.projectId;
  let local = readArray(LOCAL_KEY);
  let pending = readArray(PENDING_KEY);
  let remote = [];
  let syncRunning = null;
  let remoteReady = false;
  let authReady = false;
  let lastError = '';
  let active = true;
  let firestore = null;
  let auth = null;
  let firebaseApi = null;
  let unsubscribe = null;
  let connectionAttempt = null;
  let lastServerSnapshot = false;

  const status = () => {
    if (!hasConfig) return 'local';
    if (!remoteReady || !authReady) return lastError ? 'erro' : 'conectando';
    if (!lastServerSnapshot) return 'offline';
    return pending.length ? 'pendente' : 'online';
  };

  const emit = () => {
    const combined = rankEntries([...remote, ...local]);
    onMode(status(), pending.length);
    onChange(combined, status());
  };
  const store = {
    get mode() { return status(); },
    get pendingCount() { return pending.length; },
    refresh() { emit(); },
    async save(result) {
      const row = {
        id: makeId(),
        name: normalizeName(result.name),
        score: Math.round(result.score),
        correct: Math.round(result.correct),
        total: Math.round(result.total),
        elapsedMs: Math.max(0, Math.round(result.elapsedMs)),
        questionSet: config.questionSetVersion,
        savedAt: Date.now()
      };
      // Somente a melhor partida de cada nome precisa ser transmitida.
      // Evita várias tentativas da mesma pessoa ocuparem todo o Top 100.
      const best = rankEntries([...remote, ...local])
        .find(x => x.name.toLocaleLowerCase('pt-BR') === row.name.toLocaleLowerCase('pt-BR'));
      const isNewBest = !best || row.score > best.score
        || (row.score === best.score && row.elapsedMs < best.elapsedMs);

      if (isNewBest) {
        // Salvar primeiro no tablet é crucial: depois de cinco segundos,
        // a tela de resultado se fecha mesmo sem conexão.
        local = rankEntries([...local, row]).slice(0, 300);
        // Substitui tentativa antiga ainda não enviada do mesmo nome.
        pending = pending.filter(x =>
          x.name.toLocaleLowerCase('pt-BR') !== row.name.toLocaleLowerCase('pt-BR'));
        pending.push(row);
        try {
          persistArray(LOCAL_KEY, local);
          persistArray(PENDING_KEY, pending);
        } catch (error) {
          console.error('Erro ao gravar pontuação no tablet:', error);
          throw new Error('Sem permissão para guardar a pontuação no tablet.');
        }
        emit();
        if (authReady && firestore) {
          // Não bloqueia a página de resultados enquanto o Wi-Fi estiver lento.
          syncPending().catch(error => console.warn('Sincronização pendente:', error));
        }
      }
      return { locallySaved: true, isNewBest, pending: pending.length > 0 };
    }
  };

  const syncPending = () => {
    if (!authReady || !firestore || !pending.length || !active) return Promise.resolve();
    if (syncRunning) return syncRunning;
    syncRunning = (async () => {
      while (pending.length && authReady && active) {
        const item = pending[0];
        try {
          await firebaseApi.setDoc(
            firebaseApi.doc(firestore, COLLECTION, item.id),
            {
              name: item.name,
              score: item.score,
              correct: item.correct,
              total: item.total,
              elapsedMs: item.elapsedMs,
              questionSet: item.questionSet,
              submittedBy: auth.currentUser.uid,
              createdAt: firebaseApi.serverTimestamp()
            }
          );
          // Remove apenas depois de receber confirmação de gravação.
          pending = pending.filter(row => row.id !== item.id);
          persistArray(PENDING_KEY, pending);
          lastError = '';
          emit();
        } catch (error) {
          lastError = error?.code || String(error);
          console.warn('Falha ao sincronizar pontuação:', error);
          emit();
          break;
        }
      }
    })().finally(() => { syncRunning = null; });
    return syncRunning;
  };

  async function connect() {
    if (!hasConfig || !active) return;
    if (connectionAttempt) return connectionAttempt;
    connectionAttempt = (async () => {
      try {
        const [
          { initializeApp, getApps, getApp },
          { getFirestore, collection, query, orderBy, limit, onSnapshot, doc, setDoc, serverTimestamp },
          { getAuth, signInAnonymously }
        ] = await Promise.all([
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'),
          import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
        ]);
        const app = getApps().some(a => a.name === '[DEFAULT]')
          ? getApp() : initializeApp(firebaseConfig);
        firestore = getFirestore(app);
        auth = getAuth(app);
        firebaseApi = { doc, setDoc, serverTimestamp };
        await signInAnonymously(auth);
        authReady = Boolean(auth.currentUser);
        remoteReady = true;
        const collectionRef = collection(firestore, COLLECTION);
        const top = query(collectionRef, orderBy('score', 'desc'), limit(100));
        unsubscribe = onSnapshot(top, { includeMetadataChanges: true }, snapshot => {
          remote = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          lastServerSnapshot = !snapshot.metadata.fromCache;
          lastError = '';
          emit();
          if (lastServerSnapshot) syncPending().catch(console.warn);
        }, error => {
          lastError = error?.code || String(error);
          lastServerSnapshot = false;
          console.error('Erro ao consultar ranking Firebase:', error);
          emit();
        });
        emit();
        syncPending().catch(console.warn);
      } catch (error) {
        authReady = false;
        remoteReady = false;
        lastServerSnapshot = false;
        lastError = error?.code || String(error);
        console.warn('Firebase indisponível; modo local ativo:', error);
        emit();
      }
    })().finally(() => { connectionAttempt = null; });
    return connectionAttempt;
  }

  window.addEventListener('online', () => {
    if (!remoteReady || !authReady) connect();
    else syncPending().catch(console.warn);
    emit();
  });
  window.addEventListener('offline', () => {
    lastServerSnapshot = false;
    emit();
  });
  window.addEventListener('storage', event => {
    if (![LOCAL_KEY, PENDING_KEY].includes(event.key)) return;
    local = readArray(LOCAL_KEY);
    pending = readArray(PENDING_KEY);
    emit();
  });

  emit();
  connect();
  return store;
}
