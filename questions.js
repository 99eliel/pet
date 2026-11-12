/**
 * BANCO DE PERGUNTAS — GRUPO 6 / PET SAÚDE
 *
 * Estas questões são EXEMPLOS DE TESTE. Substitua-as pelo material oficial
 * quando estiver disponível e só depois marque isDemo como false.
 *
 * 7 perguntas Sim/Não + 3 perguntas A–D são sorteadas a cada partida.
 * A ordem das questões e a das alternativas também é embaralhada.
 *
 * correctIndex: posição da resposta correta na lista ORIGINAL (começa em 0).
 * explanation: explicação breve exibida após responder (ideal: 1 a 2 linhas).
 */
export const quizConfig = Object.freeze({
  title: 'Quiz do Grupo 6 do PET Saúde',
  secondsPerQuestion: 15,
  correctPoints: 100,
  maxSpeedBonus: 100,
  isDemo: true,
  questionSetVersion: 'exemplos-feira-v2',
  questionsPerRound: { boolean: 7, multiple: 3 },
  resultResetSeconds: 60
});

// Perguntas ilustrativas sobre promoção da saúde. NÃO são perguntas oficiais.
export const questionBank = [
  { id:'sn01', type:'boolean', prompt:'Lavar as mãos com água e sabão ajuda a prevenir infecções?', options:['Sim','Não'], correctIndex:0, explanation:'A higiene das mãos reduz a transmissão de muitos microrganismos.' },
  { id:'sn02', type:'boolean', prompt:'Antibióticos combatem todos os tipos de vírus?', options:['Sim','Não'], correctIndex:1, explanation:'Antibióticos são usados contra certas bactérias; não tratam viroses.' },
  { id:'sn03', type:'boolean', prompt:'Água parada pode favorecer a reprodução do mosquito da dengue?', options:['Sim','Não'], correctIndex:0, explanation:'O mosquito pode se desenvolver em recipientes com água parada.' },
  { id:'sn04', type:'boolean', prompt:'O protetor solar só é necessário quando vamos à praia?', options:['Sim','Não'], correctIndex:1, explanation:'A exposição solar também acontece em atividades cotidianas.' },
  { id:'sn05', type:'boolean', prompt:'As vacinas ajudam a prevenir doenças infecciosas?', options:['Sim','Não'], correctIndex:0, explanation:'Vacinas preparam a resposta imune e protegem contra doenças específicas.' },
  { id:'sn06', type:'boolean', prompt:'A pressão alta pode existir sem causar sintomas?', options:['Sim','Não'], correctIndex:0, explanation:'A hipertensão pode ser silenciosa. Medir a pressão é importante.' },
  { id:'sn07', type:'boolean', prompt:'Compartilhar objetos cortantes pode transmitir infecções?', options:['Sim','Não'], correctIndex:0, explanation:'Objetos com sangue podem transmitir infecções. Não os compartilhe.' },
  { id:'sn08', type:'boolean', prompt:'Toda pessoa com febre precisa tomar antibiótico?', options:['Sim','Não'], correctIndex:1, explanation:'A febre tem várias causas. Antibióticos exigem indicação adequada.' },
  { id:'sn09', type:'boolean', prompt:'Atividade física regular pode beneficiar a saúde mental?', options:['Sim','Não'], correctIndex:0, explanation:'Movimentar o corpo pode melhorar o bem-estar e ajudar com o estresse.' },
  { id:'sn10', type:'boolean', prompt:'Higienizar frutas e verduras ajuda a reduzir contaminações?', options:['Sim','Não'], correctIndex:0, explanation:'A higienização correta ajuda a tornar o consumo mais seguro.' },
  { id:'sn11', type:'boolean', prompt:'O mosquito da dengue se reproduz somente em rios?', options:['Sim','Não'], correctIndex:1, explanation:'Recipientes com água parada, inclusive perto de casa, são criadouros.' },
  { id:'sn12', type:'boolean', prompt:'A saúde envolve apenas a ausência de doenças?', options:['Sim','Não'], correctIndex:1, explanation:'Bem-estar físico, mental e social também fazem parte da saúde.' },
  { id:'sn13', type:'boolean', prompt:'Beber água ao longo do dia ajuda o corpo a funcionar bem?', options:['Sim','Não'], correctIndex:0, explanation:'A hidratação é importante para regular a temperatura e outras funções.' },
  { id:'sn14', type:'boolean', prompt:'Fumar faz mal apenas aos pulmões?', options:['Sim','Não'], correctIndex:1, explanation:'O tabagismo também aumenta o risco de doenças do coração e vasos.' },

  { id:'mc01', type:'multiple', prompt:'Qual atitude ajuda a prevenir a dengue?', options:['Eliminar recipientes com água parada','Manter pneus descobertos','Deixar reservatórios destampados','Guardar garrafas abertas'], correctIndex:0, explanation:'Retirar água parada evita locais de reprodução do mosquito.' },
  { id:'mc02', type:'multiple', prompt:'Qual opção é adequada para higienizar as mãos?', options:['Apenas passar na roupa','Água e sabão','Só enxaguar rapidamente','Usar perfume'], correctIndex:1, explanation:'Água e sabão removem sujeira e ajudam a reduzir microrganismos.' },
  { id:'mc03', type:'multiple', prompt:'Onde buscar informações sobre vacinação de rotina?', options:['Em mensagens sem fonte','Na unidade de saúde','Em boatos de redes sociais','Em anúncios desconhecidos'], correctIndex:1, explanation:'A unidade de saúde orienta sobre calendários e doses de vacinas.' },
  { id:'mc04', type:'multiple', prompt:'Qual alimento é uma fonte de fibras?', options:['Feijão','Refrigerante','Bala','Açúcar'], correctIndex:0, explanation:'Feijões contêm fibras, que contribuem para a saúde intestinal.' },
  { id:'mc05', type:'multiple', prompt:'Qual hábito pode favorecer a qualidade do sono?', options:['Variar o horário todos os dias','Tomar café perto de dormir','Manter horários regulares','Usar telas sem parar na cama'], correctIndex:2, explanation:'Uma rotina regular ajuda o corpo a organizar o ciclo de sono.' },
  { id:'mc06', type:'multiple', prompt:'Qual medida ajuda a prevenir infecções sexualmente transmissíveis?', options:['Tomar antibiótico por conta própria','Usar preservativo','Compartilhar seringas','Evitar exames preventivos'], correctIndex:1, explanation:'O preservativo reduz o risco de diversas ISTs quando usado corretamente.' },
  { id:'mc07', type:'multiple', prompt:'Ao tossir ou espirrar, qual atitude é mais adequada?', options:['Cobrir o rosto com o antebraço','Tossir nas mãos e tocar objetos','Virar para outra pessoa','Deixar a boca descoberta'], correctIndex:0, explanation:'Cobrir com o antebraço ajuda a reduzir a dispersão de gotículas.' },
  { id:'mc08', type:'multiple', prompt:'Qual é um benefício da atividade física frequente?', options:['Eliminar toda chance de doença','Melhorar a saúde cardiovascular','Dispensar qualquer descanso','Substituir toda consulta médica'], correctIndex:1, explanation:'A prática regular ajuda a fortalecer o coração e a circulação.' },
  { id:'mc09', type:'multiple', prompt:'Qual cuidado é indicado ao encontrar um medicamento vencido?', options:['Tomar dose dupla','Compartilhar com vizinhos','Procurar um ponto de descarte adequado','Jogar no vaso sanitário'], correctIndex:2, explanation:'O descarte correto evita riscos à saúde e contaminação ambiental.' },
  { id:'mc10', type:'multiple', prompt:'Para conhecer o calendário nacional de vacinação, qual fonte é mais confiável?', options:['Mensagens anônimas','Boatos de aplicativos','Publicações sem autoria','Ministério da Saúde e unidades de saúde'], correctIndex:3, explanation:'Fontes oficiais informam as vacinas e a orientação atualizada.' }
];

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildQuestionRound() {
  validateQuiz();
  const selected = [
    ...shuffled(questionBank.filter(q => q.type === 'boolean')).slice(0, quizConfig.questionsPerRound.boolean),
    ...shuffled(questionBank.filter(q => q.type === 'multiple')).slice(0, quizConfig.questionsPerRound.multiple)
  ];
  return shuffled(selected.map(q => {
    // Embaralha alternativas e preserva a resposta correta.
    const answers = shuffled(q.options.map((label, originalIndex) => ({
      label, correct: originalIndex === q.correctIndex
    })));
    return {
      ...q,
      options: answers.map(answer => answer.label),
      correctIndex: answers.findIndex(answer => answer.correct)
    };
  }));
}

export function validateQuiz() {
  const { boolean: booleanCount, multiple: multipleCount } = quizConfig.questionsPerRound;
  if (booleanCount !== 7 || multipleCount !== 3) {
    throw new Error('Cada partida deve ter 7 perguntas Sim/Não e 3 de múltipla escolha.');
  }
  if (new Set(questionBank.map(q => q.id)).size !== questionBank.length) {
    throw new Error('Há identificadores duplicados no banco de perguntas.');
  }
  for (const type of ['boolean', 'multiple']) {
    const pool = questionBank.filter(q => q.type === type);
    if (pool.length < quizConfig.questionsPerRound[type]) {
      throw new Error('O banco de perguntas precisa de mais perguntas do tipo ' + type + '.');
    }
    for (const q of pool) {
      if (!q.id || !String(q.prompt).trim() || !String(q.explanation).trim()
        || !Array.isArray(q.options) || q.options.length !== (type === 'boolean' ? 2 : 4)
        || q.options.some(answer => !String(answer).trim())
        || new Set(q.options.map(v => v.toLocaleLowerCase('pt-BR'))).size !== q.options.length
        || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        throw new Error('Formato inválido na pergunta ' + q.id);
      }
    }
  }
  if (quizConfig.secondsPerQuestion <= 0
    || quizConfig.correctPoints < 0 || quizConfig.maxSpeedBonus < 0) {
    throw new Error('Revise o tempo e a pontuação configurados.');
  }
}
