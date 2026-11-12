/**
 * Quiz do Grupo 6 do PET Saúde — feira
 *
 * Perguntas Sim/Não: 28 questões fornecidas pela equipe, com redação
 * revisada para clareza. Respostas e temas foram preservados.
 *
 * Perguntas A–D: 12 questões complementares com alternativas revisadas.
 * Revisão editorial documentada em docs/revisao-questoes.md.
 *
 * Cada partida sorteia 2 questões LGPD + 5 SUS de Sim/Não e
 * 1 questão LGPD + 2 SUS de A–D. Alternativas A–D são embaralhadas.
 */
export const quizConfig = Object.freeze({
  title: 'Quiz do Grupo 6 do PET Saúde',
  // A resposta nunca expira. Este valor controla apenas o bônus por rapidez.
  bonusDecaySeconds: 15,
  correctPoints: 100,
  maxSpeedBonus: 100,
  isDemo: false,
  questionSetVersion: 'feira-lgpd-sus-v1',
  questionsPerRound: { boolean: 7, multiple: 3 },
  perTheme: {
    boolean: { lgpd: 2, sus: 5 },
    multiple: { lgpd: 1, sus: 2 }
  },
  resultResetSeconds: 5
});

export const questionBank = [
  {
    "id": "lgpd-01",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "A LGPD oferece proteção especial aos dados sobre a saúde de uma pessoa?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Dados de saúde são dados pessoais sensíveis e têm proteção especial pela LGPD.",
    "source": "material-oficial",
    "topic": "dados-sensiveis"
  },
  {
    "id": "lgpd-02",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Um hospital pode publicar o resultado de um exame com o nome do paciente sem consentimento ou outra base legal?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Divulgar resultados identificáveis exige fundamento legal e respeito ao sigilo.",
    "source": "material-oficial",
    "topic": "divulgacao-dados"
  },
  {
    "id": "lgpd-03",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Um profissional de saúde deve manter sigilo sobre informações confidenciais dos pacientes?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O sigilo protege a privacidade e a confiança entre paciente e profissional.",
    "source": "material-oficial",
    "topic": "sigilo"
  },
  {
    "id": "lgpd-04",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Um funcionário pode consultar o prontuário de um paciente apenas por curiosidade?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "O prontuário só deve ser acessado quando houver necessidade profissional autorizada.",
    "source": "material-oficial",
    "topic": "acesso-prontuario"
  },
  {
    "id": "lgpd-05",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "É permitido publicar uma foto identificável de um paciente sem consentimento ou outro fundamento legal?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "A imagem identificável do paciente exige proteção e base legal para divulgação.",
    "source": "material-oficial",
    "topic": "imagem-paciente"
  },
  {
    "id": "lgpd-06",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "O paciente tem o direito de solicitar acesso às informações do próprio prontuário?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O paciente pode solicitar acesso aos seus dados de saúde ao serviço responsável.",
    "source": "material-oficial",
    "topic": "direito-acesso"
  },
  {
    "id": "lgpd-07",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "É adequado deixar exames com identificação dos pacientes expostos em um balcão acessível ao público?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Documentos identificáveis precisam ser protegidos de acessos não autorizados.",
    "source": "material-oficial",
    "topic": "documentos-expostos"
  },
  {
    "id": "lgpd-08",
    "theme": "lgpd",
    "type": "boolean",
    "prompt": "Proteger prontuários contra acessos indevidos ajuda a preservar a privacidade dos pacientes?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Proteger dados de saúde contribui para a segurança e a privacidade das pessoas.",
    "source": "material-oficial",
    "topic": "proteção-dados"
  },
  {
    "id": "sus-01",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Consultas e atendimentos oferecidos pelas UBS do SUS são gratuitos para os usuários?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS garante acesso gratuito aos serviços de saúde oferecidos na rede pública.",
    "source": "material-oficial",
    "topic": "gratuidade"
  },
  {
    "id": "sus-02",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Em caso de suspeita de infarto, é recomendado ligar para o SAMU (192) e seguir as orientações?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Suspeita de infarto é emergência. Ligue 192 para receber orientação e socorro.",
    "source": "material-oficial",
    "topic": "infarto"
  },
  {
    "id": "sus-03",
    "theme": "sus",
    "type": "boolean",
    "prompt": "As vacinas disponibilizadas pelo calendário do SUS são gratuitas nas unidades de vacinação?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "As vacinas oferecidas pelo SUS são gratuitas, conforme o calendário e a indicação.",
    "source": "material-oficial",
    "topic": "vacinação"
  },
  {
    "id": "sus-04",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Quando necessário, a equipe da UBS pode encaminhar o paciente para um especialista da rede do SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A atenção básica avalia a necessidade e coordena encaminhamentos na rede.",
    "source": "material-oficial",
    "topic": "encaminhamento"
  },
  {
    "id": "sus-05",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Em uma emergência, a falta do Cartão SUS pode ser motivo para negar atendimento?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Em urgências e emergências, a falta do Cartão SUS não impede atendimento.",
    "source": "material-oficial",
    "topic": "documento-emergencia"
  },
  {
    "id": "sus-06",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O SUS pode fornecer gratuitamente medicamentos para hipertensão e diabetes?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Medicamentos previstos nos programas e listas do SUS podem ser fornecidos gratuitamente.",
    "source": "material-oficial",
    "topic": "medicamentos"
  },
  {
    "id": "sus-07",
    "theme": "sus",
    "type": "boolean",
    "prompt": "A UBS atende apenas pessoas que já estão doentes?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "A UBS também oferece prevenção, vacinação, acompanhamento e promoção da saúde.",
    "source": "material-oficial",
    "topic": "promoção-saúde"
  },
  {
    "id": "sus-08",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Quem tem plano de saúde também pode utilizar os serviços do SUS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS é universal e atende também pessoas que possuem planos de saúde.",
    "source": "material-oficial",
    "topic": "universalidade"
  },
  {
    "id": "sus-09",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Para uma dor leve nas costas, sem sinais de gravidade, o pronto-socorro costuma ser a primeira opção?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Queixas leves e sem sinais de alerta devem ser avaliadas preferencialmente na UBS.",
    "source": "material-oficial",
    "topic": "ubs-vs-urgencia"
  },
  {
    "id": "sus-10",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O SUS também oferece consultas e tratamentos para cuidar da saúde bucal?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A rede do SUS inclui serviços odontológicos preventivos e de tratamento.",
    "source": "material-oficial",
    "topic": "odontologia"
  },
  {
    "id": "sus-11",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O atendimento odontológico oferecido pelas equipes de saúde bucal das UBS é gratuito?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O atendimento odontológico disponibilizado pelo SUS não é cobrado do paciente.",
    "source": "material-oficial",
    "topic": "odontologia-gratuita"
  },
  {
    "id": "sus-12",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Em um atendimento odontológico pelo SUS, o paciente precisa pagar separadamente pelos materiais usados?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Os materiais utilizados nos procedimentos oferecidos pelo SUS não são cobrados.",
    "source": "material-oficial",
    "topic": "materiais-odontológicos"
  },
  {
    "id": "sus-13",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Uma gestante pode realizar acompanhamento pré-natal pelo SUS na UBS?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A atenção básica oferece acompanhamento pré-natal gratuito às gestantes.",
    "source": "material-oficial",
    "topic": "pre-natal"
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
    "explanation": "A puericultura acompanha a saúde e o desenvolvimento de bebês e crianças.",
    "source": "material-oficial",
    "topic": "puericultura"
  },
  {
    "id": "sus-15",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O SUS pode oferecer exame preventivo do colo do útero e mamografia, quando indicados?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "O SUS oferece exames de prevenção e rastreamento conforme indicação e protocolos.",
    "source": "material-oficial",
    "topic": "rastreio-câncer"
  },
  {
    "id": "sus-16",
    "theme": "sus",
    "type": "boolean",
    "prompt": "A oferta de testes rápidos e coleta de exames pode variar de uma UBS para outra?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Esses serviços existem na atenção básica, mas a oferta depende da estrutura local.",
    "source": "material-oficial",
    "topic": "testes-ubs"
  },
  {
    "id": "sus-17",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Basta pedir uma tomografia na recepção da UBS, sem avaliação de um profissional de saúde?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Exames de maior complexidade geralmente exigem avaliação e solicitação profissional.",
    "source": "material-oficial",
    "topic": "exames-complexos"
  },
  {
    "id": "sus-18",
    "theme": "sus",
    "type": "boolean",
    "prompt": "O SUS pode contar com psicólogos e nutricionistas nas equipes multiprofissionais, conforme a rede local?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "A oferta desses profissionais depende da organização da rede de saúde.",
    "source": "material-oficial",
    "topic": "equipes-multiprofissionais"
  },
  {
    "id": "sus-19",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Grupos de caminhada e atividade física promovidos pela UBS fazem parte da promoção da saúde?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 0,
    "explanation": "Atividades coletivas ajudam na prevenção e no incentivo a hábitos saudáveis.",
    "source": "material-oficial",
    "topic": "atividade-física"
  },
  {
    "id": "sus-20",
    "theme": "sus",
    "type": "boolean",
    "prompt": "Atendimentos psicológicos e nutricionais pelo SUS são exclusivos de pessoas internadas?",
    "options": [
      "Sim",
      "Não"
    ],
    "correctIndex": 1,
    "explanation": "Esses atendimentos também podem ocorrer na atenção básica e em outros serviços.",
    "source": "material-oficial",
    "topic": "psicologia-nutrição"
  },
  {
    "id": "lgpd-m01",
    "theme": "lgpd",
    "prompt": "Qual informação é considerada um dado pessoal sensível pela LGPD?",
    "options": [
      "Horário de funcionamento de uma UBS",
      "Resultado de exame ligado a um paciente identificado",
      "Endereço do prédio de um hospital",
      "Telefone público de uma recepção"
    ],
    "correctIndex": 1,
    "explanation": "Resultados de exames identificáveis revelam informações sensíveis de saúde.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "dados-sensiveis"
  },
  {
    "id": "lgpd-m02",
    "theme": "lgpd",
    "prompt": "Em qual situação um profissional pode acessar o prontuário de um paciente?",
    "options": [
      "Para conhecer o histórico de um vizinho",
      "Quando participa de uma atividade de cuidado autorizada",
      "Quando um colega pede por curiosidade",
      "Apenas porque o prontuário ficou aberto no computador"
    ],
    "correctIndex": 1,
    "explanation": "O acesso deve estar ligado a uma atividade profissional necessária e autorizada.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "acesso-prontuario"
  },
  {
    "id": "lgpd-m03",
    "theme": "lgpd",
    "prompt": "Qual prática ajuda a proteger informações de saúde dos pacientes?",
    "options": [
      "Enviar exames em um grupo público de mensagens",
      "Deixar prontuários disponíveis a visitantes",
      "Utilizar sistema autorizado com acesso restrito",
      "Compartilhar a senha entre todos os funcionários"
    ],
    "correctIndex": 2,
    "explanation": "Acesso individual e restrito ajuda a evitar exposição indevida de prontuários.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "proteção-dados"
  },
  {
    "id": "lgpd-m04",
    "theme": "lgpd",
    "prompt": "Como uma pessoa pode solicitar uma cópia do próprio prontuário?",
    "options": [
      "Pelos canais oficiais do serviço de saúde",
      "Pedindo a senha de um funcionário",
      "Entrando na conta de outro paciente",
      "Pegando documentos sem passar pelo serviço responsável"
    ],
    "correctIndex": 0,
    "explanation": "O paciente deve solicitar seus dados ao serviço pelos canais adequados.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "direito-acesso"
  },
  {
    "id": "sus-m01",
    "theme": "sus",
    "prompt": "Uma pessoa tem dor leve nas costas há dias, sem sinais de gravidade. Onde buscar a primeira avaliação?",
    "options": [
      "Na UPA para atendimento de emergência",
      "Na UBS, para avaliação inicial",
      "Pelo SAMU 192, como transporte para consulta",
      "No pronto-socorro hospitalar, obrigatoriamente"
    ],
    "correctIndex": 1,
    "explanation": "A UBS costuma ser a porta de entrada para queixas leves e sem sinais de alerta.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "ubs-vs-urgencia"
  },
  {
    "id": "sus-m02",
    "theme": "sus",
    "prompt": "Uma pessoa sente dor forte e súbita no peito, acompanhada de suor frio. Qual é a atitude mais indicada?",
    "options": [
      "Esperar a dor passar em casa",
      "Marcar uma consulta de rotina para outro dia",
      "Ligar para o SAMU pelo número 192",
      "Tomar um medicamento indicado por um conhecido"
    ],
    "correctIndex": 2,
    "explanation": "Dor súbita no peito pode ser emergência. Acione o SAMU pelo número 192.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "infarto"
  },
  {
    "id": "sus-m03",
    "theme": "sus",
    "prompt": "Qual serviço costuma acompanhar o pré-natal de rotina pelo SUS?",
    "options": [
      "A UBS, por meio da equipe de atenção básica",
      "A UPA, voltada para urgências",
      "O SAMU, por meio de ambulâncias",
      "O pronto-socorro, apenas nos plantões"
    ],
    "correctIndex": 0,
    "explanation": "O pré-natal habitual é acompanhado na atenção básica, com encaminhamento quando necessário.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "pre-natal"
  },
  {
    "id": "sus-m04",
    "theme": "sus",
    "prompt": "Qual afirmação sobre o acesso ao SUS está correta?",
    "options": [
      "O atendimento é exclusivo para pessoas sem emprego",
      "Quem tem plano de saúde não pode usar o SUS",
      "Todas as pessoas podem utilizar o SUS, inclusive quem tem plano",
      "Só pode ser atendido quem já usou o SUS antes"
    ],
    "correctIndex": 2,
    "explanation": "O SUS é universal e pode atender também quem possui plano de saúde.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "universalidade"
  },
  {
    "id": "sus-m05",
    "theme": "sus",
    "prompt": "Qual atividade é um exemplo de promoção da saúde em uma UBS?",
    "options": [
      "Cirurgia de urgência em hospital",
      "Grupo de caminhada e educação em saúde",
      "Transporte de paciente em ambulância",
      "Atendimento hospitalar após acidente grave"
    ],
    "correctIndex": 1,
    "explanation": "Atividades coletivas incentivam a prevenção e estilos de vida saudáveis.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "promoção-saúde"
  },
  {
    "id": "sus-m06",
    "theme": "sus",
    "prompt": "Quem pode avaliar a necessidade e solicitar uma tomografia pelo SUS?",
    "options": [
      "A recepção, sem avaliação profissional",
      "O paciente, diretamente no setor de imagem",
      "Um profissional de saúde habilitado",
      "Qualquer acompanhante, sem avaliação"
    ],
    "correctIndex": 2,
    "explanation": "Exames especializados dependem de avaliação e solicitação por profissional habilitado.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "exames-complexos"
  },
  {
    "id": "sus-m07",
    "theme": "sus",
    "prompt": "Qual opção representa um serviço de vacinação gratuito do SUS?",
    "options": [
      "Vacinas oferecidas na rede pública conforme o calendário",
      "Qualquer vacina escolhida em clínica particular",
      "Toda medicação vendida em uma farmácia privada",
      "Todos os procedimentos escolhidos em serviços particulares"
    ],
    "correctIndex": 0,
    "explanation": "As vacinas disponibilizadas pela rede do SUS são gratuitas para o público indicado.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "vacinação"
  },
  {
    "id": "sus-m08",
    "theme": "sus",
    "prompt": "O que significa puericultura na atenção básica?",
    "options": [
      "Acompanhamento do crescimento e desenvolvimento infantil",
      "Atendimento restrito a emergências de bebês",
      "Vacinação realizada apenas em hospitais",
      "Exames de imagem obrigatórios para todas as crianças"
    ],
    "correctIndex": 0,
    "explanation": "A puericultura acompanha a saúde de crianças e bebês durante o desenvolvimento.",
    "type": "multiple",
    "source": "complementar-criada",
    "topic": "puericultura"
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
  const usedTopics = new Set();
  // Sorteia as questões A–D primeiro, depois escolhe Sim/Não de temas distintos.
  // Isso evita perguntas repetidas sobre o mesmo assunto na mesma partida.
  for (const type of ['multiple', 'boolean']) {
    for (const theme of ['lgpd', 'sus']) {
      const quota = quizConfig.perTheme[type][theme];
      const available = shuffled(questionBank.filter(q =>
        q.type === type && q.theme === theme && !usedTopics.has(q.topic)));
      if (available.length < quota) {
        throw new Error('Banco sem temas suficientes para ' + type + '/' + theme);
      }
      const chosen = available.slice(0, quota);
      selected.push(...chosen);
      for (const q of chosen) usedTopics.add(q.topic);
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
    if (!q.id || !q.theme || !q.topic || !['boolean', 'multiple'].includes(q.type)
      || !q.prompt?.trim() || !q.explanation?.trim()
      || !Array.isArray(q.options) || q.options.length !== (q.type === 'boolean' ? 2 : 4)
      || q.options.some(answer => typeof answer !== 'string' || !answer.trim())
      || new Set(q.options.map(x => x.toLocaleLowerCase('pt-BR'))).size !== q.options.length
      || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      throw new Error('Pergunta inválida: ' + (q.id || '(sem ID)'));
    }
  }
  if (!(quizConfig.bonusDecaySeconds > 0 && quizConfig.correctPoints >= 0
    && quizConfig.maxSpeedBonus >= 0 && quizConfig.resultResetSeconds > 0)) {
    throw new Error('Configuração de pontos ou retorno inválida.');
  }
}
