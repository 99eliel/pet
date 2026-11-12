/**
 * PERGUNTAS DO QUIZ — GRUPO 6 / PET SAÚDE
 *
 * Substitua os enunciados e as alternativas quando o conteúdo oficial estiver pronto.
 * correctIndex começa em 0 (primeira alternativa):
 *   - Sim/Não: 0 = Sim, 1 = Não
 *   - Múltipla escolha: 0 = A, 1 = B, 2 = C, 3 = D
 *
 * IMPORTANTE: altere isDemo para false somente depois de revisar e publicar
 * as 10 perguntas oficiais. Enquanto isDemo=true, o ranking é apenas local.
 */
export const quizConfig = Object.freeze({
  title: 'Quiz do Grupo 6 do PET Saúde',
  secondsPerQuestion: 15,
  correctPoints: 100,
  maxSpeedBonus: 100,
  isDemo: true,
  questionSetVersion: 'rascunho-v1'
});

export const questions = [
  {
    id: 'sn-01',
    type: 'boolean',
    prompt: 'Pergunta 1 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 0
  },
  {
    id: 'sn-02',
    type: 'boolean',
    prompt: 'Pergunta 2 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 1
  },
  {
    id: 'sn-03',
    type: 'boolean',
    prompt: 'Pergunta 3 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 0
  },
  {
    id: 'sn-04',
    type: 'boolean',
    prompt: 'Pergunta 4 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 1
  },
  {
    id: 'sn-05',
    type: 'boolean',
    prompt: 'Pergunta 5 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 0
  },
  {
    id: 'sn-06',
    type: 'boolean',
    prompt: 'Pergunta 6 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 1
  },
  {
    id: 'sn-07',
    type: 'boolean',
    prompt: 'Pergunta 7 — o enunciado oficial será incluído aqui.',
    options: ['Sim', 'Não'],
    correctIndex: 0
  },
  {
    id: 'mc-01',
    type: 'multiple',
    prompt: 'Pergunta 8 — inclua aqui a primeira questão de múltipla escolha.',
    options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
    correctIndex: 2
  },
  {
    id: 'mc-02',
    type: 'multiple',
    prompt: 'Pergunta 9 — inclua aqui a segunda questão de múltipla escolha.',
    options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
    correctIndex: 0
  },
  {
    id: 'mc-03',
    type: 'multiple',
    prompt: 'Pergunta 10 — inclua aqui a terceira questão de múltipla escolha.',
    options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
    correctIndex: 3
  }
];

export function validateQuiz() {
  if (questions.length !== 10) {
    throw new Error('O quiz precisa ter exatamente 10 perguntas.');
  }
  const booleanCount = questions.filter(question => question.type === 'boolean').length;
  const multipleCount = questions.filter(question => question.type === 'multiple').length;
  if (booleanCount !== 7 || multipleCount !== 3) {
    throw new Error('O quiz precisa de 7 perguntas Sim/Não e 3 de múltipla escolha.');
  }
  if (questions.some(question => !Array.isArray(question.options)
    || question.options.length !== (question.type === 'boolean' ? 2 : 4)
    || !Number.isInteger(question.correctIndex)
    || question.correctIndex < 0 || question.correctIndex >= question.options.length
    || !String(question.prompt).trim())) {
    throw new Error('Revise o formato das perguntas e os índices de respostas corretas.');
  }
  if (!(quizConfig.secondsPerQuestion > 0 && quizConfig.correctPoints >= 0 && quizConfig.maxSpeedBonus >= 0)) {
    throw new Error('Revise os parâmetros de pontuação.');
  }
}
