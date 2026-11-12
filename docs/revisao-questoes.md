# Revisão editorial do Quiz PET Saúde — Grupo 6

Data: 12/11/2026

## Escopo

Revisamos **40 perguntas** que aparecem no PWA:

- **28 perguntas Sim/Não** originalmente fornecidas pela equipe do PET Saúde (8 LGPD, 20 SUS).
- **12 perguntas A–D** complementares criadas para o quiz (4 LGPD, 8 SUS).

**Importante:** os enunciados e as explicações da equipe foram adaptados editorialmente para clareza, precisão e leitura no tablet. O conteúdo original pode ser consultado no histórico Git anterior à revisão do arquivo `questions.js`. As alternativas corretas das 28 perguntas originais foram preservadas.

## Problemas corrigidos

| Pergunta | Problema identificado | Decisão |
|---|---|---|
| SUS 02 — suspeita de infarto | Dizia que "UPA ou hospital" é a resposta única para casos graves, sem orientar a acionar o atendimento móvel. | Substituída por "Em caso de suspeita de infarto, é recomendado ligar para o SAMU (192) e seguir as orientações?" (Sim). |
| SUS 04 — especialista | Poderia sugerir que todo acesso a especialista exige encaminhamento prévio da UBS. | Reformulada para destacar que a equipe da UBS **pode** encaminhar quando necessário. |
| SUS 09 — dor nas costas | Faltava delimitar sinais de gravidade na comparação UBS/pronto-socorro. | Incluída a condição "sem sinais de gravidade". |
| SUS 11 — atendimento odontológico na UBS | Poderia sugerir que qualquer UBS sempre tem atendimento odontológico. | Agora se refere ao atendimento **oferecido pelas equipes de saúde bucal**. |
| SUS 15 — preventivo e mamografia | Faltava esclarecer que a realização depende de indicação. | Acrescentado "quando indicados". |
| SUS 16 — testes na UBS | Dava a entender que todos os testes e coletas citados ocorrem em qualquer UBS. | Agora explica que a oferta **varia conforme a estrutura e organização local**. |
| LGPD 02 e 05 — exames/fotos | Proibição genérica "sem autorização" poderia ignorar outras bases legais. | Feita referência a **consentimento ou outro fundamento legal**. |
| Alternativas A–D (12 questões) | Algumas respostas erradas eram muito irreais e continham palavras como "somente" e "exclusivamente". | Reescritas para serem mais naturais, mantendo **uma única resposta correta**. |

Todas as questões receberam um identificador de assunto (`topic`). No sorteio de cada partida, não repetimos o mesmo assunto entre as questões selecionadas. Isso reduz situações como uma pergunta sobre puericultura imediatamente seguida por outra com a mesma resposta.

## Como as partidas continuam funcionando

- 2 LGPD + 5 SUS (Sim/Não).
- 1 LGPD + 2 SUS (A–D).
- Perguntas e alternativas A–D em ordem aleatória.
- Sem tempo limite para responder; apenas o bônus de rapidez diminui.
- Explicação breve após a resposta.
- Tela de resultados retorna ao início após 5 segundos.
- Ranking e PWA mantidos. **Não houve exclusão nem limpeza de pontuações do Firebase.**

## Fontes externas usadas para conferir pontos sensíveis

- [Ministério da Saúde — SAMU 192](https://www.gov.br/saude/pt-br/composicao/saes/samu-192/samu-192): suspeita de infarto e outras emergências.
- [Ministério da Saúde — UBS ou UPA](https://www.gov.br/saude/pt-br/assuntos/noticias/2025/outubro/ubs-ou-upa-saiba-quando-procurar-a-unidade-mais-proxima-de-voce): características da atenção básica e das urgências.
- [Ministério da Saúde — Saúde bucal no SUS](https://www.gov.br/saude/pt-br/acesso-a-informacao/faq/acoes-programas-e-politicas-do-sus/como-conseguir-atendimento-tratamento-de-saude): UBS com equipe de saúde bucal e encaminhamentos.
- [Ministério da Saúde — Censo das UBS](https://www.gov.br/saude/pt-br/composicao/saps/censo-das-ubs): variações da oferta de procedimentos e infraestrutura.
- [ANPD — Perguntas frequentes LGPD](https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes): hipóteses legais para tratamento de dados.

## Validações automáticas realizadas

- 40 identificadores únicos, 28 perguntas Sim/Não e 12 A–D.
- Respostas corretas dentro do índice das alternativas.
- Enunciado e explicação presentes em todas as perguntas.
- Explicações curtas (todas com até 115 caracteres nesta revisão).
- 1.500 sorteios simulados sem falta de perguntas, com 10 temas distintos por rodada.

**Nota:** ainda é recomendável a última leitura pela coordenação do PET Saúde antes da feira.
