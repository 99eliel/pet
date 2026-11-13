import { firebaseConfig } from './firebase-config.js';
import { questionBank } from './questions.js';

const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('pt-BR');
const pct = (yes, total) => total ? (100 * yes / total).toFixed(1).replace('.', ',') + '%' : '—';
const meanAge = (sum, count) => count ? (sum / count).toFixed(1).replace('.', ',') + ' anos' : '—';
const validAge = age => Number.isInteger(age) && age >= 1 && age <= 120;
const PAGE_SIZE = 250;
const MAX_ATTEMPTS = 10000;
// Conveniência visual para o evento, não é um segredo seguro no código público.
// O Firestore continua exigindo um UID autorizado no servidor.
const EVENT_PIN = '00000000';
let pinUnlocked = false;
let firebase = null;
let auth = null;
let db = null;
let adminUser = null;
let attempts = [];
let loaded = false;
let truncated = false;
let currentSessionId = 'legado';
let rowsForExport = [];

function showMessage(id, value) { $(id).textContent = value; }
function friendlyError(error) {
  if (error?.code === 'auth/too-many-requests') return 'Muitas tentativas de conexão. Tente novamente mais tarde.';
  if (error?.code === 'permission-denied') return 'Acesso negado pelo Firebase. Confira o cadastro de administrador e as regras do Firestore.';
  if (!navigator.onLine || error?.code === 'unavailable') return 'Sem conexão com o Firebase. Conecte à internet e tente novamente.';
  return 'Não foi possível concluir a operação. ' + (error?.message || 'Verifique as configurações do Firebase.');
}

async function ensureFirebase() {
  if (firebase) return;
  const [
    { initializeApp, getApp, getApps },
    {
      getFirestore, doc, getDocFromServer, getDocsFromServer, collection,
      query, orderBy, limit, startAfter, setDoc, serverTimestamp
    },
    {
      getAuth, signInAnonymously, setPersistence, browserLocalPersistence
    }
  ] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js')
  ]);
  const appName = 'pet-quiz-admin';
  const app = getApps().find(a => a.name === appName)
    || initializeApp(firebaseConfig, appName);
  db = getFirestore(app);
  auth = getAuth(app);
  // O UID anônimo precisa continuar igual depois de fechar/reabrir o navegador.
  // Caso contrário seria necessário autorizar o dispositivo toda vez.
  await setPersistence(auth, browserLocalPersistence);
  if (typeof auth.authStateReady === 'function') await auth.authStateReady();
  firebase = {
    doc, getDocFromServer, getDocsFromServer, collection, query,
    orderBy, limit, startAfter, setDoc, serverTimestamp,
    signInAnonymously
  };
}

async function authorizeDevice() {
  const user = auth?.currentUser;
  if (!user || !pinUnlocked) throw new Error('Digite a senha para acessar o painel.');
  const adminDoc = await firebase.getDocFromServer(firebase.doc(db, 'pet_grupo6_admins', user.uid));
  if (!adminDoc.exists() || adminDoc.data()?.active !== true) {
    adminUser = null;
    $('loginArea').hidden = true;
    $('adminPanel').hidden = true;
    $('adminSetup').hidden = false;
    $('adminDeviceUid').textContent = user.uid;
    showMessage('setupMessage', 'Faça a autorização uma vez no Firebase e toque em “Já autorizei, verificar”.');
    return false;
  }

  adminUser = user;
  $('loginArea').hidden = true;
  $('adminSetup').hidden = true;
  $('adminPanel').hidden = false;
  $('adminIdentity').textContent = 'Este navegador';
  $('adminPassword').value = '';
  showMessage('loginMessage', '');
  await refreshReport();
  if (location.hash === '#zerar') {
    $('resetSection').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  return true;
}

async function signIn(event) {
  event.preventDefault();
  const password = $('adminPassword').value;
  const button = $('loginButton');
  if (password !== EVENT_PIN) {
    $('adminPassword').value = '';
    showMessage('loginMessage', 'Senha incorreta.');
    $('adminPassword').focus();
    return;
  }

  button.disabled = true;
  pinUnlocked = true;
  showMessage('loginMessage', 'Conferindo autorização do dispositivo...');
  try {
    await ensureFirebase();
    if (!auth.currentUser) await firebase.signInAnonymously(auth);
    await authorizeDevice();
  } catch (error) {
    console.error('Autorização administrativa:', error);
    showMessage('loginMessage', friendlyError(error));
  } finally {
    button.disabled = false;
    $('adminPassword').value = '';
  }
}

function lockPanel() {
  // Não desconectar o usuário anônimo: sua identidade é o cadastro do
  // dispositivo no Firestore. Apenas bloqueie a interface com o PIN.
  pinUnlocked = false;
  adminUser = null;
  attempts = [];
  loaded = false;
  rowsForExport = [];
  $('adminPanel').hidden = true;
  $('adminSetup').hidden = true;
  $('loginArea').hidden = false;
  $('adminPassword').value = '';
  showMessage('loginMessage', '');
  $('adminPassword').focus();
}

async function recheckAuthorization() {
  const button = $('checkAuthorization');
  button.disabled = true;
  showMessage('setupMessage', 'Verificando autorização no Firebase...');
  try {
    await authorizeDevice();
  } catch (error) {
    showMessage('setupMessage', friendlyError(error));
  } finally {
    button.disabled = false;
  }
}

async function copyDeviceUid() {
  const uid = $('adminDeviceUid').textContent;
  try {
    await navigator.clipboard.writeText(uid);
    showMessage('setupMessage', 'Identificador copiado. Cole como ID do documento no Firestore.');
  } catch {
    showMessage('setupMessage', 'Selecione e copie manualmente o identificador acima.');
  }
}

async function loadCurrentSession() {
  const control = await firebase.getDocFromServer(firebase.doc(db, 'pet_grupo6_controle', 'placar'));
  currentSessionId = control.exists() ? control.data().sessionId : 'legado';
  if (!/^legado$|^ed-[a-zA-Z0-9_-]{12,60}$/.test(currentSessionId)) {
    throw new Error('Identificador de edição inválido no Firebase.');
  }
  $('activeSessionLabel').textContent = currentSessionId === 'legado'
    ? 'Placar original'
    : 'Edição ' + currentSessionId.slice(-8);
}

async function fetchAllAttempts() {
  const data = [];
  let last = null;
  let reachedEnd = false;
  while (data.length < MAX_ATTEMPTS && !reachedEnd) {
    const parts = [
      firebase.collection(db, 'pet_grupo6_tentativas'),
      firebase.orderBy('createdAt', 'asc'),
      firebase.limit(PAGE_SIZE)
    ];
    // query() aceita referência, orderBy, limit, startAfter.
    const q = last
      ? firebase.query(parts[0], parts[1], parts[2], firebase.startAfter(last))
      : firebase.query(parts[0], parts[1], parts[2]);
    const snapshot = await firebase.getDocsFromServer(q);
    for (const item of snapshot.docs) data.push({ id: item.id, ...item.data() });
    last = snapshot.docs[snapshot.docs.length - 1] || null;
    reachedEnd = snapshot.size < PAGE_SIZE || !last;
  }
  return { attempts: data, truncated: !reachedEnd };
}

async function refreshReport() {
  if (!adminUser || !firebase || !navigator.onLine) {
    showMessage('loadMessage', 'A administração requer conexão à internet.');
    return;
  }
  $('refreshReport').disabled = true;
  $('printReport').disabled = true;
  $('downloadCsv').disabled = true;
  showMessage('loadMessage', 'Carregando respostas registradas no Firebase...');
  try {
    await loadCurrentSession();
    const data = await fetchAllAttempts();
    attempts = data.attempts;
    truncated = data.truncated;
    loaded = true;
    renderReport();
    showMessage('loadMessage', truncated
      ? 'Relatório parcial: foi atingido o limite de ' + fmt(MAX_ATTEMPTS) + ' partidas. Faça uma exportação mais específica no servidor para análise integral.'
      : 'Dados atualizados. ' + fmt(attempts.length) + ' partidas com respostas registradas.');
    $('printReport').disabled = false;
    $('downloadCsv').disabled = false;
  } catch (error) {
    console.error('Relatório Firebase:', error);
    loaded = false;
    showMessage('loadMessage', friendlyError(error));
  } finally {
    $('refreshReport').disabled = false;
  }
}

function calculate() {
  const scope = $('reportScope').value;
  const records = scope === 'current'
    ? attempts.filter(record => record.sessionId === currentSessionId)
    : attempts;

  const byId = new Map(questionBank.map(q => [
    q.id, { id: q.id, prompt: q.prompt, theme: q.theme, total: 0, wrong: 0, correct: 0, errorAgeSum: 0, errorAgeCount: 0 }
  ]));
  const byTheme = {
    lgpd: { total: 0, correct: 0 },
    sus: { total: 0, correct: 0 }
  };
  let responseTotal = 0;
  let correctTotal = 0;
  let ageSum = 0;
  let ageCount = 0;

  for (const record of records) {
    if (validAge(record.age)) {
      ageSum += record.age;
      ageCount++;
    }
    if (!Array.isArray(record.answers)) continue;
    const counted = new Set();
    for (const answer of record.answers) {
      if (!answer || typeof answer.questionId !== 'string' ||
        typeof answer.correct !== 'boolean' || counted.has(answer.questionId)) continue;
      counted.add(answer.questionId);
      if (!byId.has(answer.questionId)) {
        const theme = answer.questionId.startsWith('lgpd') ? 'lgpd' : 'sus';
        byId.set(answer.questionId, {
          id: answer.questionId, prompt: 'Questão arquivada (' + answer.questionId + ')',
          theme, total: 0, correct: 0, wrong: 0, errorAgeSum: 0, errorAgeCount: 0
        });
      }
      const item = byId.get(answer.questionId);
      item.total++;
      responseTotal++;
      if (answer.correct) {
        item.correct++;
        correctTotal++;
      } else {
        item.wrong++;
        if (validAge(record.age)) {
          item.errorAgeSum += record.age;
          item.errorAgeCount++;
        }
      }

      if (byTheme[item.theme]) {
        byTheme[item.theme].total++;
        if (answer.correct) byTheme[item.theme].correct++;
      }
    }
  }
  const rows = [...byId.values()].filter(item => item.total > 0).sort((a,b) =>
    (b.wrong / b.total) - (a.wrong / a.total)
    || b.wrong - a.wrong || b.total - a.total || a.id.localeCompare(b.id));
  return { scope, records, responseTotal, correctTotal, ageSum, ageCount, byTheme, rows };
}

function renderReport() {
  if (!loaded) return;
  const data = calculate();
  rowsForExport = data.rows;
  $('metricAttempts').textContent = fmt(data.records.length);
  $('metricResponses').textContent = fmt(data.responseTotal);
  $('metricAccuracy').textContent = pct(data.correctTotal, data.responseTotal);
  $('metricError').textContent = pct(data.responseTotal - data.correctTotal, data.responseTotal);
  $('metricAverageAge').textContent = meanAge(data.ageSum, data.ageCount);
  $('metricAgeCoverage').textContent = fmt(data.ageCount) + ' de ' + fmt(data.records.length) + ' partidas com idade';

  for (const [key, label] of [['lgpd','Lgpd'],['sus','Sus']]) {
    const result = data.byTheme[key];
    const errors = result.total - result.correct;
    $('theme' + label).textContent = pct(errors, result.total);
    $('bar' + label).style.width = result.total ? (100 * errors / result.total) + '%' : '0%';
    $('detail' + label).textContent = fmt(errors) + ' erros em ' + fmt(result.total) + ' respostas';
  }
  $('reportMeta').textContent =
    (data.scope === 'current' ? 'Edição atual' : 'Histórico completo') +
    ' · Gerado em ' + new Date().toLocaleString('pt-BR') +
    ' · Fonte: Firebase Firestore';

  const body = $('questionRows');
  body.replaceChildren();
  if (!data.rows.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 7;
    td.className = 'table-empty';
    td.textContent = 'Ainda não há partidas com respostas registradas neste período.';
    tr.append(td);
    body.append(tr);
    return;
  }
  for (const row of data.rows) {
    const tr = document.createElement('tr');
    const prompt = document.createElement('td');
    prompt.textContent = row.prompt;
    const id = document.createElement('span');
    id.className = 'question-id';
    id.textContent = row.id;
    prompt.append(id);
    tr.append(prompt);
    for (const value of [
      row.theme.toUpperCase(), fmt(row.total), fmt(row.wrong), fmt(row.correct)
    ]) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    const rateCell = document.createElement('td');
    const chip = document.createElement('span');
    const ratio = 100 * row.wrong / row.total;
    chip.className = 'rate-chip' + (ratio >= 50 ? ' high' : ratio >= 25 ? ' medium' : '');
    chip.textContent = pct(row.wrong, row.total);
    rateCell.append(chip);
    tr.append(rateCell);
    const ageCell = document.createElement('td');
    ageCell.textContent = meanAge(row.errorAgeSum, row.errorAgeCount);
    if (row.errorAgeCount > 0) {
      const count = document.createElement('small');
      count.className = 'question-id';
      count.textContent = fmt(row.errorAgeCount) + (row.errorAgeCount === 1 ? ' idade conhecida' : ' idades conhecidas');
      ageCell.append(count);
    }
    tr.append(ageCell);
    body.append(tr);
  }
}

function downloadCsv() {
  if (!loaded) return;
  const csvCell = value => '"' + String(value).replace(/"/g, '""') + '"';
  const summary = calculate();
  const rows = [
    ['Resumo', 'Valor'],
    ['Período', summary.scope === 'current' ? 'Edição atual' : 'Todas as edições'],
    ['Partidas concluídas', summary.records.length],
    ['Partidas com idade informada', summary.ageCount],
    ['Idade média geral (anos)', summary.ageCount ? (summary.ageSum / summary.ageCount).toFixed(1).replace('.', ',') : ''],
    ['Respostas analisadas', summary.responseTotal],
    ['Erros', summary.responseTotal - summary.correctTotal],
    [],
    ['ID', 'Tema', 'Pergunta', 'Respostas', 'Erros', 'Acertos', 'Taxa de erro (%)', 'Idade média de quem errou (anos)', 'Erros com idade conhecida'],
    ...rowsForExport.map(row => [
      row.id, row.theme.toUpperCase(), row.prompt, row.total,
      row.wrong, row.correct, (100 * row.wrong / row.total).toFixed(1).replace('.', ','),
      row.errorAgeCount ? (row.errorAgeSum / row.errorAgeCount).toFixed(1).replace('.', ',') : '',
      row.errorAgeCount
    ])
  ];
  const text = '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'relatorio-erros-pet-saude-' + $('reportScope').value + '.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function resetRanking(event) {
  event.preventDefault();
  if (!adminUser || $('resetPhrase').value.trim() !== 'ZERAR') return;
  if (!navigator.onLine) {
    showMessage('resetMessage', 'É necessário estar conectado para zerar o placar.');
    return;
  }
  if (!confirm('Iniciar uma nova edição com Top 5 vazio? O histórico de respostas será preservado. Esta ação afetará todos os dispositivos.')) return;
  const btn = $('resetButton');
  btn.disabled = true;
  showMessage('resetMessage', 'Atualizando placar no Firebase...');
  try {
    // Confirma acesso ao servidor, evitando um reset que fique apenas no cache.
    const ref = firebase.doc(db, 'pet_grupo6_controle', 'placar');
    await firebase.getDocFromServer(ref);
    const token = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2, 20));
    const sid = 'ed-' + token;
    await firebase.setDoc(ref, {
      sessionId: sid,
      resetAt: firebase.serverTimestamp(),
      resetBy: adminUser.uid
    });
    const verified = await firebase.getDocFromServer(ref);
    if (!verified.exists() || verified.data()?.sessionId !== sid) {
      throw new Error('A alteração não foi confirmada pelo servidor.');
    }
    currentSessionId = sid;
    $('reportScope').value = 'current';
    $('resetPhrase').value = '';
    showMessage('resetMessage', 'Novo placar iniciado! A edição anterior foi preservada. Abra o quiz para conferir o Top 5 vazio.');
    await refreshReport();
  } catch (error) {
    console.error('Reset do placar:', error);
    showMessage('resetMessage', friendlyError(error));
  } finally {
    btn.disabled = $('resetPhrase').value.trim() !== 'ZERAR';
  }
}

$('loginForm').addEventListener('submit', signIn);
$('logoutButton').addEventListener('click', lockPanel);
$('cancelAuthorization').addEventListener('click', lockPanel);
$('checkAuthorization').addEventListener('click', recheckAuthorization);
$('copyAdminUid').addEventListener('click', copyDeviceUid);
$('reportScope').addEventListener('change', renderReport);
$('refreshReport').addEventListener('click', refreshReport);
$('printReport').addEventListener('click', () => {
  if (loaded) window.print(); // No navegador, escolher "Salvar como PDF".
});
$('downloadCsv').addEventListener('click', downloadCsv);
$('resetPhrase').addEventListener('input', () => {
  $('resetButton').disabled = $('resetPhrase').value.trim() !== 'ZERAR';
});
$('resetForm').addEventListener('submit', resetRanking);

if (location.hash === '#zerar') {
  // Redireciona a leitura, não efetua nenhuma ação sem login e confirmação.
  $('resetSection').scrollIntoView({ block: 'start' });
}
