/**
 * Quiz do Grupo 6 do PET Saúde — feira
 *
 * Perguntas Sim/Não: 28 fornecidas pela equipe, preservando os
 * enunciados, respostas e explicações originais.
 *
 * Perguntas A–D: complementares, criadas para a dinâmica da feira
 * com base nos mesmos temas. Revisar com a equipe antes do evento.
 *
 * Cada partida sorteia 2 questões LGPD + 5 SUS de Sim/Não e
 * 1 questão LGPD + 2 SUS de A–D. Alternativas A–D são embaralhadas.
 */
export const quizConfig = Object.freeze({
  title: 'Quiz do Grupo 6 do PET Saúde',
  secondsPerQuestion: 15,
  correctPoints: 100,
  maxSpeedBonus: 100,
  isDemo: false,
  questionSetVersion: 'feira-lgpd-sus-v1',
  questionsPerRound: { boolean: 7, multiple: 3 },
  perTheme: {
    boolean: { lgpd: 2, sus: 5 },
    multiple: { lgpd: 1, sus: 2 }
  },
  resultResetSeconds: 60
});

export const questionBank = [
  {
    "id": "lgpd-01",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Dados sobre a saúde de uma pessoa são protegidos pela LGPD?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Dados de saúde são considerados dados sensíveis e recebem proteção especial pela LGPD.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-02",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Um hospital pode divulgar os exames de um paciente sem autorização dele?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Informações de saúde são confidenciais e só podem ser divulgadas nas situações previstas em lei.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-03",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "O profissional de saúde deve manter sigilo sobre as informações do paciente?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O sigilo profissional protege a privacidade e a confiança na relação entre paciente e profissional.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-04",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "É permitido acessar prontuários de pacientes apenas por curiosidade?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "O acesso ao prontuário deve ocorrer apenas quando necessário para o atendimento ou atividade autorizada.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-05",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Posso publicar fotos de pacientes sem autorização ou sem justificativa prevista em lei?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "A imagem do paciente também é protegida e não pode ser divulgada sem autorização ou fundamento legal.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-06",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "O paciente pode solicitar acesso ao seu prontuário médico?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "As informações pertencem ao paciente, que tem direito de acessar seus dados de saúde.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-07",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Deixar exames ou documentos médicos expostos para qualquer pessoa ver é correto?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Essa prática viola a privacidade do paciente e pode descumprir a LGPD.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-08",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Proteger os dados dos pacientes é uma forma de respeitar sua privacidade?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A proteção de dados contribui para a dignidade, segurança e privacidade das pessoas.",
    "source": "material-oficial"
  },
  {
    "id": "sus-01",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O atendimento na Unidade Básica de Saúde (UBS) é gratuito?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS garante atendimento gratuito à população.",
    "source": "material-oficial"
  },
  {
    "id": "sus-02",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Em caso de infarto, acidente grave ou situação com risco de vida, o local mais indicado é a UPA ou hospital de urgência?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Casos graves e emergenciais devem ser atendidos em serviços de urgência e emergência.",
    "source": "material-oficial"
  },
  {
    "id": "sus-03",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Posso tomar as vacinas do calendário de vacinação na UBS sem pagar nada?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "As vacinas oferecidas pelo SUS são gratuitas.",
    "source": "material-oficial"
  },
  {
    "id": "sus-04",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Na maioria dos casos, é necessário encaminhamento da atenção básica para consultar um especialista pelo SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Geralmente, o médico da UBS avalia o paciente e faz o encaminhamento quando necessário.",
    "source": "material-oficial"
  },
  {
    "id": "sus-05",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Se eu não tiver o Cartão SUS durante uma emergência, posso ter o atendimento negado?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Em situações de urgência e emergência, o atendimento não pode ser recusado por falta de documentos.",
    "source": "material-oficial"
  },
  {
    "id": "sus-06",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Medicamentos para pressão alta e diabetes podem ser fornecidos gratuitamente pelo SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Diversos medicamentos essenciais são disponibilizados gratuitamente.",
    "source": "material-oficial"
  },
  {
    "id": "sus-07",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O posto de saúde serve apenas para quem já está doente?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "A UBS também atua na prevenção, vacinação, acompanhamento e promoção da saúde.",
    "source": "material-oficial"
  },
  {
    "id": "sus-08",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Pessoas que possuem plano de saúde também podem utilizar o SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS é um sistema universal e pode ser utilizado por toda a população.",
    "source": "material-oficial"
  },
  {
    "id": "sus-09",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Se eu sentir uma dor leve nas costas há vários dias, o melhor local para procurar atendimento é o pronto-socorro?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Situações sem urgência devem ser avaliadas preferencialmente na UBS.",
    "source": "material-oficial"
  },
  {
    "id": "sus-10",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O atendimento odontológico faz parte dos serviços oferecidos pelo SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS oferece diversos serviços relacionados à saúde bucal.",
    "source": "material-oficial"
  },
  {
    "id": "sus-11",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O atendimento odontológico na UBS é gratuito?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Os serviços odontológicos disponibilizados pelo SUS não geram custos ao paciente.",
    "source": "material-oficial"
  },
  {
    "id": "sus-12",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Para realizar tratamento odontológico na UBS, é necessário pagar pelos materiais utilizados?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Os materiais usados nos procedimentos são fornecidos pelo serviço público de saúde.",
    "source": "material-oficial"
  },
  {
    "id": "sus-13",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O acompanhamento da gravidez (pré-natal) pode ser realizado na UBS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O pré-natal é um dos serviços oferecidos gratuitamente pelo SUS.",
    "source": "material-oficial"
  },
  {
    "id": "sus-14",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Puericultura é o acompanhamento do crescimento e desenvolvimento das crianças?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A puericultura acompanha a saúde de bebês e crianças durante seu desenvolvimento.",
    "source": "material-oficial"
  },
  {
    "id": "sus-15",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O exame preventivo do câncer do colo do útero e a mamografia podem ser realizados pelo SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS oferece ações de prevenção e encaminha pacientes para exames quando indicados.",
    "source": "material-oficial"
  },
  {
    "id": "sus-16",
    "theme": "sus",
    "type": "boolean",
    "prompt": "A UBS realiza exames simples, como teste de gravidez, teste de glicemia e coleta de exames laboratoriais básicos?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Muitas unidades oferecem exames rápidos e coleta para análises laboratoriais.",
    "source": "material-oficial"
  },
  {
    "id": "sus-17",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Posso solicitar diretamente na recepção da UBS exames complexos, como tomografia ou ressonância magnética?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Esses exames normalmente precisam ser solicitados por um profissional de saúde.",
    "source": "material-oficial"
  },
  {
    "id": "sus-18",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O SUS pode oferecer atendimento com psicólogos, nutricionistas e outros profissionais das equipes multiprofissionais (eMulti)?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Dependendo da organização local da rede, esses profissionais podem atuar no apoio às equipes de saúde.",
    "source": "material-oficial"
  },
  {
    "id": "sus-19",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Participar de grupos de caminhada, atividade física e outras ações promovidas pela UBS faz parte dos cuidados oferecidos pelo SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A promoção da saúde e a prevenção de doenças também fazem parte das ações do SUS.",
    "source": "material-oficial"
  },
  {
    "id": "sus-20",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O atendimento psicológico e nutricional é destinado apenas a pessoas internadas em hospitais?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Esses atendimentos também podem ocorrer nas UBS e em serviços comunitários de saúde.",
    "source": "material-oficial"
  },
  {
    "id": "lgpd-m01",
    "theme": "lgpd",
    "prompt": "Qual dessas informações recebe proteção especial pela LGPD?",
    "options": [
      "O horário de funcionamento da UBS",
      "O resultado de um exame de um paciente",
      "O endereço público do hospital",
      "A lista de serviços disponíveis"
    ],
    "correctIndex": 1,
    "explanation": "Resultados de exames são dados pessoais sensíveis e exigem proteção.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "lgpd-m02",
    "theme": "lgpd",
    "prompt": "Um funcionário encontra um prontuário. Quando pode consultá-lo?",
    "options": [
      "Sempre que tiver curiosidade",
      "Quando for atividade autorizada e necessária",
      "Para comentar com amigos",
      "Quando estiver sem tarefas"
    ],
    "correctIndex": 1,
    "explanation": "Prontuários só devem ser acessados para necessidades profissionais autorizadas.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "lgpd-m03",
    "theme": "lgpd",
    "prompt": "Qual atitude respeita a privacidade dos pacientes?",
    "options": [
      "Deixar exames à vista de visitantes",
      "Divulgar fotos sem fundamento legal",
      "Proteger documentos e limitar o acesso",
      "Compartilhar prontuários em grupos pessoais"
    ],
    "correctIndex": 2,
    "explanation": "Restringir o acesso evita exposição indevida dos dados de saúde.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "lgpd-m04",
    "theme": "lgpd",
    "prompt": "O paciente deseja conhecer as informações do próprio prontuário. O que deve fazer?",
    "options": [
      "Solicitar acesso pelos canais do serviço de saúde",
      "Pedir a outro paciente para acessar",
      "Publicar seus dados nas redes sociais",
      "Entrar sem autorização no sistema"
    ],
    "correctIndex": 0,
    "explanation": "O paciente pode solicitar acesso aos seus dados de saúde ao serviço responsável.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m01",
    "theme": "sus",
    "prompt": "Onde procurar atendimento para um problema de saúde sem sinais de urgência?",
    "options": [
      "Sempre no pronto-socorro",
      "Preferencialmente na UBS",
      "Apenas no hospital de internação",
      "Somente no SAMU"
    ],
    "correctIndex": 1,
    "explanation": "A UBS é, em geral, a porta de entrada para cuidados sem urgência.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m02",
    "theme": "sus",
    "prompt": "Em qual situação é indicado procurar urgência ou emergência?",
    "options": [
      "Revisão de rotina",
      "Dúvida sobre vacinação",
      "Suspeita de infarto",
      "Agendar consulta sem urgência"
    ],
    "correctIndex": 2,
    "explanation": "Sinais de infarto exigem avaliação imediata em serviço de emergência.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m03",
    "theme": "sus",
    "prompt": "Qual serviço pode fazer parte do atendimento na UBS?",
    "options": [
      "Pré-natal",
      "Apenas cirurgia de alta complexidade",
      "Somente internação hospitalar",
      "Exclusivamente transplantes"
    ],
    "correctIndex": 0,
    "explanation": "O acompanhamento pré-natal faz parte dos cuidados oferecidos na atenção básica.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m04",
    "theme": "sus",
    "prompt": "Quem pode utilizar os serviços do SUS?",
    "options": [
      "Somente quem não trabalha",
      "Apenas quem não tem plano de saúde",
      "Somente pessoas com Cartão SUS em mãos",
      "Toda a população, inclusive quem tem plano"
    ],
    "correctIndex": 3,
    "explanation": "O SUS é universal e pode ser utilizado também por quem possui plano de saúde.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m05",
    "theme": "sus",
    "prompt": "Qual atividade é um exemplo de promoção da saúde na UBS?",
    "options": [
      "Apenas internação",
      "Grupos de caminhada e atividade física",
      "Cirurgias de transplante",
      "Somente atendimento de emergência"
    ],
    "correctIndex": 1,
    "explanation": "Grupos de atividade física incentivam prevenção e hábitos saudáveis.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m06",
    "theme": "sus",
    "prompt": "Quem normalmente solicita uma tomografia pelo SUS, quando indicada?",
    "options": [
      "Qualquer pessoa na fila da recepção",
      "Somente o segurança da unidade",
      "Um profissional de saúde habilitado",
      "Outro paciente que esteja aguardando"
    ],
    "correctIndex": 2,
    "explanation": "Exames de maior complexidade dependem de avaliação e solicitação profissional.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m07",
    "theme": "sus",
    "prompt": "Qual dos serviços abaixo pode ser oferecido gratuitamente pelo SUS?",
    "options": [
      "Apenas consultas particulares",
      "Vacinação do calendário de rotina",
      "Somente serviços privados",
      "Exclusivamente tratamentos estéticos"
    ],
    "correctIndex": 1,
    "explanation": "As vacinas oferecidas pelo SUS são gratuitas para a população elegível.",
    "type": "multiple",
    "source": "complementar-criada"
  },
  {
    "id": "sus-m08",
    "theme": "sus",
    "prompt": "O que é puericultura?",
    "options": [
      "Acompanhamento do crescimento e desenvolvimento infantil",
      "Exame exclusivo de adultos",
      "Serviço apenas odontológico",
      "Atendimento restrito a emergências"
    ],
    "correctIndex": 0,
    "explanation": "Puericultura acompanha a saúde de bebês e crianças ao longo do desenvolvimento.",
    "type": "multiple",
    "source": "complementar-criada"
  }
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
  const selected = [];
  for (const type of ['boolean', 'multiple']) {
    for (const theme of ['lgpd', 'sus']) {
      const quota = quizConfig.perTheme[type][theme];
      selected.push(...shuffled(questionBank.filter(q =>
        q.type === type && q.theme === theme)).slice(0, quota));
    }
  }
  return shuffled(selected.map(q => {
    if (q.type === 'boolean') return { ...q, options: [...q.options] };
    const alternatives = shuffled(q.options.map((label, originalIndex) => ({
      label, correct: originalIndex === q.correctIndex
    })));
    return {
      ...q,
      options: alternatives.map(answer => answer.label),
      correctIndex: alternatives.findIndex(answer => answer.correct)
    };
  }));
}

export function validateQuiz() {
  for (const type of ['boolean', 'multiple']) {
    const quota = Object.values(quizConfig.perTheme[type]).reduce((a, b) => a + b, 0);
    if (quota !== quizConfig.questionsPerRound[type]) {
      throw new Error('Quantidade de perguntas incompatível com os temas.');
    }
    for (const [theme, required] of Object.entries(quizConfig.perTheme[type])) {
      if (questionBank.filter(q => q.type === type && q.theme === theme).length < required) {
        throw new Error('Banco insuficiente para ' + type + '/' + theme);
      }
    }
  }

  if (quizConfig.questionsPerRound.boolean !== 7 || quizConfig.questionsPerRound.multiple !== 3) {
    throw new Error('A rodada precisa de 7 Sim/Não e 3 de múltipla escolha.');
  }
  if (new Set(questionBank.map(q => q.id)).size !== questionBank.length) {
    throw new Error('Há identificadores de perguntas repetidos.');
  }
  for (const q of questionBank) {
    if (!q.id || !q.theme || !['boolean', 'multiple'].includes(q.type)
      || !q.prompt?.trim() || !q.explanation?.trim()
      || !Array.isArray(q.options) || q.options.length !== (q.type === 'boolean' ? 2 : 4)
      || q.options.some(answer => typeof answer !== 'string' || !answer.trim())
      || new Set(q.options.map(x => x.toLocaleLowerCase('pt-BR'))).size !== q.options.length
      || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      throw new Error('Pergunta inválida: ' + (q.id || '(sem ID)'));
    }
  }
  if (!(quizConfig.secondsPerQuestion > 0 && quizConfig.correctPoints >= 0
    && quizConfig.maxSpeedBonus >= 0)) throw new Error('Configuração de tempo/pontos inválida.');
}
