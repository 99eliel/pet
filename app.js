import { buildQuestionRound, quizConfig, validateQuiz } from './questions.js';
import { startLeaderboard, rankEntries } from './scores.js';

const $ = id => document.getElementById(id);
const views = ['homeView', 'setupView', 'quizView', 'resultView'];
const number = value => Number(value).toLocaleString('pt-BR');
const durationMs = quizConfig.secondsPerQuestion * 1000;
const roundSize = quizConfig.questionsPerRound.boolean + quizConfig.questionsPerRound.multiple;
const maxScore = roundSize * (quizConfig.correctPoints + quizConfig.maxSpeedBonus);
let questions = [];
let leaderboardStore = null;
let leaderboardPromise = null;
let currentRanking = [];
let rankingMode = 'local';
let player = '';
let questionIndex = 0;
let totalScore = 0;
let correctAnswers = 0;
let totalAnswerTimeMs = 0;
let questionStartedAt = 0;
let frameId = null;
let transitionId = null;
let resultTimeoutId = null;
let questionLocked = true;

function showView(viewName) {
  for (const id of views) $(id).hidden = id !== viewName;
  window.scrollTo({ top: 0, behavior: 'instant' });
  const heading = $(viewName).querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function renderRanking(entries) {
  currentRanking = rankEntries(entries);
  const list = $('leaderboardList');
  list.replaceChildren();
  if (!currentRanking.length) {
    const item = document.createElement('li');
    item.className = 'empty-ranking';
    const icon = document.createElement('span');
    icon.className = 'empty-trophy';
    icon.textContent = '🏆';
    const text = document.createElement('span');
    text.textContent = 'O pódio ainda está vazio. Seja a primeira pessoa a participar!';
    item.append(icon, text);
    list.append(item);
    return;
  }
  for (const [index, entry] of currentRanking.slice(0, 5).entries()) {
    const item = document.createElement('li');
    const position = document.createElement('span');
    position.className = 'rank-number';
    position.textContent = String(index + 1).padStart(2, '0');
    const avatar = document.createElement('span');
    avatar.className = 'rank-avatar';
    avatar.textContent = entry.name.charAt(0).toLocaleUpperCase('pt-BR');
    const name = document.createElement('span');
    name.className = 'rank-name';
    name.textContent = entry.name;
    name.title = entry.name;
    const points = document.createElement('span');
    points.className = 'rank-score';
    points.textContent = number(entry.score);
    const suffix = document.createElement('small');
    suffix.textContent = ' pts';
    points.append(suffix);
    item.append(position, avatar, name, points);
    list.append(item);
  }
}

function setRankingMode(mode) {
  rankingMode = mode;
  const indicator = $('rankingIndicator');
  indicator.classList.toggle('online', mode === 'online');
  const scope = $('rankingScope');
  if (mode === 'online') scope.textContent = 'Ranking geral • atualizado automaticamente';
  else if (mode === 'erro') scope.textContent = 'Conexão do ranking indisponível';
  else scope.textContent = quizConfig.isDemo ? 'Ranking de teste • neste aparelho' : 'Ranking deste aparelho';
}

function goHome() {
  clearQuestionTimers();
  clearResultTimeout();
  player = '';
  showView('homeView');
  leaderboardStore?.refresh();
}

function openSetup() {
  clearQuestionTimers();
  clearResultTimeout();
  player = '';
  showView('setupView');
  $('nameError').textContent = '';
  $('playerName').value = '';
  $('playerName').focus();
}

function clearResultTimeout() {
  if (resultTimeoutId !== null) {
    clearTimeout(resultTimeoutId);
    resultTimeoutId = null;
  }
}

function clearQuestionTimers() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
  if (transitionId !== null) {
    clearTimeout(transitionId);
    transitionId = null;
  }
  questionLocked = true;
}

function beginQuiz() {
  const proposedName = $('playerName').value.replace(/\s+/g, ' ').trim();
  if (proposedName.length < 2) {
    $('nameError').textContent = 'Digite um nome com pelo menos 2 caracteres.';
    $('playerName').focus();
    return;
  }
  player = proposedName.slice(0, 28);
  questions = buildQuestionRound();
  questionIndex = 0;
  totalScore = 0;
  correctAnswers = 0;
  totalAnswerTimeMs = 0;
  $('currentPlayer').textContent = player;
  $('runningScore').textContent = '0';
  showView('quizView');
  renderQuestion();
}

function buildProgress() {
  const container = $('questionProgress');
  container.replaceChildren();
  for (let index = 0; index < questions.length; index += 1) {
    const segment = document.createElement('span');
    if (index < questionIndex) segment.className = 'done';
    if (index === questionIndex) segment.className = 'current';
    container.append(segment);
  }
}

function renderQuestion() {
  clearQuestionTimers();
  const question = questions[questionIndex];
  if (!question) return void finishQuiz();
  questionLocked = false;
  $('questionCounter').textContent = 'PERGUNTA ' + String(questionIndex + 1).padStart(2, '0');
  $('questionTotal').textContent = '/ ' + questions.length;
  $('questionType').textContent = (question.theme === 'lgpd' ? 'LGPD' : 'SUS') + ' · ' + (question.type === 'boolean' ? 'SIM OU NÃO' : 'MÚLTIPLA ESCOLHA');
  $('questionTitle').textContent = question.prompt;
  $('answerFeedback').textContent = '';
  $('answerFeedback').classList.remove('bad');
  $('explanationBox').hidden = true;
  $('explanationText').textContent = '';
  $('nextQuestion').hidden = true;
  buildProgress();
  const answers = $('answerGrid');
  answers.replaceChildren();
  for (const [index, option] of question.options.entries()) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    const key = document.createElement('span');
    key.className = 'answer-key';
    key.textContent = question.type === 'boolean' ? ['✓', '✕'][index] : 'ABCD'[index];
    const text = document.createElement('span');
    text.textContent = option;
    button.append(key, text);
    button.addEventListener('click', () => answerQuestion(index));
    answers.append(button);
  }
  questionStartedAt = performance.now();
  tickTimer();
}

function tickTimer() {
  if (questionLocked) return;
  const elapsed = Math.max(0, performance.now() - questionStartedAt);
  const remaining = Math.max(0, durationMs - elapsed);
  const fraction = durationMs ? remaining / durationMs : 0;
  $('timerNumber').textContent = (remaining / 1000).toFixed(1).replace('.', ',') + 's';
  $('timerBar').style.width = (fraction * 100).toFixed(2) + '%';
  const urgent = remaining <= 5000;
  $('timerNumber').classList.toggle('urgent', urgent);
  $('timerBar').classList.toggle('urgent', urgent);
  if (remaining <= 0) {
    answerQuestion(null);
    return;
  }
  frameId = requestAnimationFrame(tickTimer);
}

function answerQuestion(selectedIndex) {
  if (questionLocked) return;
  questionLocked = true;
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null;

  const question = questions[questionIndex];
  const elapsed = selectedIndex === null
    ? durationMs
    : Math.min(durationMs, Math.max(0, performance.now() - questionStartedAt));
  const timedOut = selectedIndex === null || elapsed >= durationMs;
  const isCorrect = !timedOut && selectedIndex === question.correctIndex;
  totalAnswerTimeMs += elapsed;

  const buttons = [...$('answerGrid').querySelectorAll('.answer-option')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.correctIndex) button.classList.add('correct');
    else if (index === selectedIndex) button.classList.add('wrong');
    else button.classList.add('dimmed');
  });

  const feedback = $('answerFeedback');
  if (isCorrect) {
    correctAnswers += 1;
    const speedRatio = Math.max(0, (durationMs - elapsed) / durationMs);
    const earned = quizConfig.correctPoints + Math.round(speedRatio * quizConfig.maxSpeedBonus);
    totalScore += earned;
    $('runningScore').textContent = number(totalScore);
    feedback.textContent = '✓ Resposta correta! +' + number(earned) + ' pontos';
  } else {
    feedback.classList.add('bad');
    feedback.textContent = (timedOut ? '⏰ Tempo esgotado!' : '✕ Resposta incorreta.')
      + ' Resposta certa: ' + question.options[question.correctIndex];
  }

  // O participante lê a justificativa sem o relógio correndo.
  $('explanationText').textContent = question.explanation;
  $('explanationBox').hidden = false;
  $('nextQuestion').textContent = questionIndex === questions.length - 1
    ? 'Ver meu resultado →' : 'Próxima pergunta →';
  $('nextQuestion').hidden = false;
  $('nextQuestion').focus({ preventScroll: true });
  // Em tablets na horizontal, garanta que a explicação e o avanço
  // fiquem visíveis, mesmo quando o conteúdo for mais alto que a tela.
  requestAnimationFrame(() => {
    $('nextQuestion').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  // Se o visitante deixar o jogo na explicação, o tablet se libera
  // automaticamente para a pessoa seguinte após 90 segundos.
  transitionId = setTimeout(goHome, 90_000);
}

function advanceAfterFeedback() {
  if (!questionLocked || $('nextQuestion').hidden) return;
  questionIndex += 1;
  if (questionIndex < questions.length) renderQuestion();
  else finishQuiz();
}

async function finishQuiz() {
  clearQuestionTimers();
  showView('resultView');
  $('resultName').textContent = player;
  $('finalScore').textContent = number(totalScore);
  $('maxResultScore').textContent = number(maxScore);
  $('correctCount').textContent = correctAnswers + '/' + questions.length;
  $('totalTime').textContent = (totalAnswerTimeMs / 1000).toFixed(1).replace('.', ',') + 's';
  $('rankPosition').textContent = '—';
  $('saveMessage').textContent = 'Registrando sua pontuação...';
  clearResultTimeout();
  resultTimeoutId = setTimeout(goHome, quizConfig.resultResetSeconds * 1000);

  const record = {
    name: player,
    score: totalScore,
    correct: correctAnswers,
    total: questions.length,
    elapsedMs: Math.round(totalAnswerTimeMs)
  };

  try {
    const store = leaderboardStore || await leaderboardPromise;
    if (!store) throw new Error('Ranking indisponível.');
    await store.save(record);
    const ordered = rankEntries([...currentRanking, record]);
    const place = ordered.findIndex(entry => entry.name.toLocaleLowerCase('pt-BR') === player.toLocaleLowerCase('pt-BR'));
    $('rankPosition').textContent = place === -1 ? '—' : (place + 1) + 'º';
    $('saveMessage').textContent = store.mode === 'online'
      ? 'Sua pontuação foi enviada para o ranking geral.'
      : 'Pontuação salva neste aparelho. O ranking geral ainda não foi ativado.';
  } catch (error) {
    console.error(error);
    $('saveMessage').textContent = 'Não foi possível salvar a pontuação. Confira a conexão ou as permissões do navegador.';
  }
}

function setupLogo() {
  const logo = $('uploadedLogo');
  const fallback = $('fallbackLogo');
  logo.addEventListener('load', () => {
    if (logo.naturalWidth > 0) {
      logo.hidden = false;
      fallback.hidden = true;
    }
  });
  logo.addEventListener('error', () => {
    logo.hidden = true;
    fallback.hidden = false;
  });
  if (logo.complete && logo.naturalWidth > 0) {
    logo.hidden = false;
    fallback.hidden = true;
  }
}

function setupEventHandlers() {
  $('startButton').addEventListener('click', openSetup);
  document.querySelectorAll('[data-go-home]').forEach(button => button.addEventListener('click', goHome));
  $('playerForm').addEventListener('submit', event => { event.preventDefault(); beginQuiz(); });
  $('playerName').addEventListener('input', () => { $('nameError').textContent = ''; });
  $('playAgain').addEventListener('click', openSetup);
  $('nextQuestion').addEventListener('click', advanceAfterFeedback);
  $('backToHome').addEventListener('click', goHome);
  $('refreshRanking').addEventListener('click', () => leaderboardStore?.refresh());
}

function initialize() {
  try { validateQuiz(); } catch (error) {
    console.error(error);
    $('startButton').disabled = true;
    $('demoNotice').textContent = 'As perguntas precisam ser revisadas antes de iniciar.';
    return;
  }
  $('heroSeconds').textContent = quizConfig.secondsPerQuestion + 's';
  $('rulesSeconds').textContent = quizConfig.secondsPerQuestion + ' segundos';
  $('heroMaxScore').textContent = number(maxScore);
  $('maxResultScore').textContent = number(maxScore);
  $('demoNotice').hidden = !quizConfig.isDemo;
  $('questionTotal').textContent = '/ ' + roundSize;
  $('resultAutoReset').textContent = 'A tela volta ao início automaticamente após ' + quizConfig.resultResetSeconds + ' segundos.';
  $('currentYear').textContent = new Date().getFullYear();
  setupLogo();
  setupEventHandlers();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.warn('Modo offline não disponível:', error);
    });
  }
  setRankingMode('local');
  leaderboardPromise = startLeaderboard({
    config: quizConfig,
    onChange: renderRanking,
    onMode: setRankingMode
  }).then(store => {
    leaderboardStore = store;
    return store;
  }).catch(error => {
    console.error('Falha ao inicializar ranking:', error);
    setRankingMode('erro');
    return null;
  });
}

initialize();
