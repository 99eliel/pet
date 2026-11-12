import { firebaseConfig } from './firebase-config.js';

/** Normaliza e classifica por pontuação; empate: menor tempo. */
export function rankEntries(entries) {
  const byName = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.name !== 'string' || !Number.isFinite(entry.score)) continue;
    const name = entry.name.trim().slice(0, 28);
    if (!name) continue;
    const normalized = { ...entry, name, elapsedMs: Number(entry.elapsedMs) || 0 };
    const key = name.toLocaleLowerCase('pt-BR');
    const current = byName.get(key);
    if (!current || normalized.score > current.score ||
      (normalized.score === current.score && normalized.elapsedMs < current.elapsedMs)) {
      byName.set(key, normalized);
    }
  }
  return [...byName.values()].sort((a, b) => b.score - a.score || a.elapsedMs - b.elapsedMs
    || String(a.name).localeCompare(String(b.name), 'pt-BR'));
}

function useLocalScores(onChange, onMode, config) {
  const key = config.isDemo ? 'pet-grupo6-ranking-demo-v1' : 'pet-grupo6-ranking-v1';
  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  };
  const emit = () => onChange(rankEntries(load()), 'local');
  window.addEventListener('storage', (event) => { if (event.key === key) emit(); });
  onMode('local');
  emit();
  return {
    mode: 'local',
    refresh: emit,
    async save(result) {
      const record = { ...result, createdAt: Date.now() };
      const all = rankEntries([...load(), record]).slice(0, 100);
      try { localStorage.setItem(key, JSON.stringify(all)); } catch {
        throw new Error('Não foi possível salvar neste navegador. Verifique se o armazenamento local está permitido.');
      }
      emit();
      return record;
    }
  };
}

/**
 * Ranking geral opcional, usando Firebase Firestore + Authentication anônima.
 * Com configurações ausentes ou perguntas de demonstração, usa somente
 * armazenamento local do navegador (não compartilhado entre aparelhos).
 */
export async function startLeaderboard({ config, onChange, onMode }) {
  if (config.isDemo || !firebaseConfig || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return useLocalScores(onChange, onMode, config);
  }

  try {
    const [
      { initializeApp, getApps, getApp },
      { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp },
      { getAuth, signInAnonymously }
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
    ]);
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await signInAnonymously(auth);
    const db = getFirestore(app);
    const scores = collection(db, 'pet_grupo6_ranking');
    const rankingQuery = query(scores, orderBy('score', 'desc'), limit(100));
    let cached = [];
    let listenerError = null;
    onSnapshot(rankingQuery, snapshot => {
      cached = rankEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      listenerError = null;
      onChange(cached, 'online');
    }, error => {
      listenerError = error;
      console.error('Erro ao buscar ranking:', error);
      onMode('erro');
    });
    onMode('online');
    return {
      mode: 'online',
      refresh() { onChange(cached, listenerError ? 'erro' : 'online'); },
      async save(result) {
        if (listenerError) throw new Error('O ranking online está indisponível.');
        const payload = {
          name: result.name,
          score: result.score,
          correct: result.correct,
          total: result.total,
          elapsedMs: result.elapsedMs,
          questionSet: config.questionSetVersion,
          createdAt: serverTimestamp()
        };
        await addDoc(scores, payload);
        return payload;
      }
    };
  } catch (error) {
    console.warn('Ranking online indisponível. Usando ranking local.', error);
    return useLocalScores(onChange, onMode, config);
  }
}
