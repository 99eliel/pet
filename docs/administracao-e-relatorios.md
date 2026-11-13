# Administração, reset do placar e relatório de desempenho — PET Saúde

Este documento descreve a nova interface disponível em:

**https://99eliel.github.io/pet/admin.html**

Na tela inicial do quiz, na seção do Top 5, aparecem os botões **Gerar relatório** e **Zerar placar**. Os dois exigem autenticação administrativa.

## Ajuste: participação pelo celular e idade voluntária

O cadastro exige somente **nome/apelido**. A **idade é opcional**; quando preenchida, o tablet abre teclado numérico e valida de 1 a 120 anos. Participantes que não informam idade continuam participando normalmente e têm todos os erros contabilizados no relatório.

A tela inicial possui o botão **Responder pelo celular**, que abre um QR Code do endereço **https://99eliel.github.io/pet/**. A mesma página pode ser acessada por múltiplos celulares e tablets; o ranking e as tentativas são sincronizados no Firebase de acordo com as permissões configuradas. O QR funciona offline no tablet, mas **o visitante precisa de conexão para abrir o site no celular**. O código QR é produzido sem terceiros pelo arquivo `qr.js`, a partir de uma matriz QR fixa para esse endereço.

As médias de idade **não atribuem zero** a quem não preenche o campo. O painel exibe o número de partidas com idade conhecida e calcula as médias apenas entre elas. A média de idade entre erros de uma questão usa somente os erros com idade conhecida.

## Nova coleta de idade

Na identificação do participante, o quiz solicita **nome/apelido e idade opcional**. O campo opcional de idade usa teclado numérico no tablet e aceita números inteiros de 1 a 120. A idade não é exibida no Top 5.

Nas **novas partidas concluídas**, o registro privado em `pet_grupo6_tentativas/{id}` pode conter o campo `age` (inteiro de 1 a 120). Ele fica junto às respostas, **sem nome/apelido**, e só é disponibilizado aos responsáveis autorizados pelas regras do Firestore.

O relatório inclui:
- idade média de todas as partidas com idade conhecida (soma das idades ÷ total de partidas com idade conhecida);
- número de partidas com idade conhecida para contextualizar a média;
- idade média de quem **errou cada pergunta**, calculada só entre os erros daquela questão com idade conhecida;
- essas médias nas exportações PDF (impressão) e CSV, além dos números de erros/acertos.

**Importante:** partidas anteriores que não têm `age` ficam de fora das médias; nenhum valor será inventado. Partidas antigas com respostas ainda contribuem para taxas de erro. Cada partida conta uma vez nas médias, mesmo que seja de uma pessoa que já participou, portanto não se trata de participantes únicos.

### Compatibilidade de regras e offline

É necessário **republicar `firestore.rules`** para admitir o novo campo `age`; caso contrário, o Firestore rejeitará novas tentativas. A regra aceita idade ausente apenas para sincronizar partidas de versões anteriores que ainda estejam guardadas no tablet offline. O nome segue armazenado apenas no ranking, e não no documento analítico de tentativa.

## 1. Como funciona o relatório

Cada partida **concluída após esta atualização** armazena, no Firestore, um documento de respostas em `pet_grupo6_tentativas/{id}` contendo:
- identificador da edição do placar (sem dados pessoais);
- versão do questionário;
- 10 registros com ID da questão, acerto/erro e duração da resposta;
- total de acertos e horário de envio ao servidor.

**Nome ou apelido NÃO acompanha o documento de respostas**, apenas a pontuação do ranking. A coleção de tentativas é de **leitura restrita aos responsáveis autorizados**.

O relatório oferece filtros:
- **Todas as edições:** agrega as tentativas registradas desde a implantação da funcionalidade.
- **Somente edição atual:** agrega as tentativas registradas após o reset mais recente.

Métricas:
- partidas concluídas (não necessariamente participantes únicos);
- respostas analisadas e taxa média de acertos/erros;
- acertos de LGPD e SUS;
- perguntas com **maior taxa de erro**, da maior para a menor, com quantidades de erros, acertos e respostas.

Fórmula: **taxa de erro por questão = erros da questão ÷ respostas recebidas naquela questão × 100**.

O sorteio faz com que questões diferentes tenham tamanhos de amostra diferentes. O painel mostra o tamanho da amostra e **não inventa números** para perguntas que ainda não foram respondidas. Uma questão com 1 erro em 1 resposta tem taxa de 100%, mas amostra muito pequena; interprete os dois números juntos.

Para imprimir:
1. Faça login no painel.
2. Selecione o período.
3. Clique **Gerar relatório em PDF**.
4. Na janela de impressão, escolha **Salvar como PDF**.

O documento pode incluir múltiplas páginas e tem layout A4 de impressão. **Exportar CSV** disponibiliza a tabela em formato de planilha.

### Limitações honestas

- Antes desta atualização, o quiz gravava apenas pontuação final. **Não é possível descobrir retrospectivamente as perguntas erradas nessas partidas.**
- Partidas ainda na fila offline do tablet só aparecem no relatório depois da sincronização com o Firebase.
- A estatística descreve os **participantes do estande**, não uma amostra representativa da população geral.
- A aplicação é feita em navegador. Para competição com premiação de valor, seria necessário conferir respostas e pontuação em servidor confiável.

## 2. Zerar placar sem apagar histórico

A ação **não deleta** o ranking anterior nem os dados históricos. Ela define uma **nova edição ativa** no documento:

`pet_grupo6_controle/placar`

O quiz passa a exibir somente o ranking da edição atual:
- antes do primeiro reset: coleção legada `pet_grupo6_ranking`;
- depois do reset: `pet_grupo6_placares/{sessionId}/entradas`.

O relatório **Todas as edições** continua incluindo todas as partidas novas que foram sincronizadas, mesmo após zerar o placar. O filtro **Edição atual** começa do zero junto com o novo ranking.

A ação exige login autorizado e digitar **ZERAR**, além de uma confirmação final. É preciso estar conectado à internet. Todos os tablets online atualizam automaticamente ao receber o novo ID da edição no Firestore.

**Cuidado:** não utilize o reset enquanto um participante estiver respondendo. O sistema guarda a edição em que a pessoa começou, de modo que uma partida iniciada antes do reset pertença à edição anterior.

## 3. Ativação obrigatória no Firebase (uma vez)

**As alterações do código e das regras estão no repositório, mas publicar o GitHub NÃO publica as regras no Firebase.** Para ativar de verdade:

1. Acesse o projeto **petsaude6** em https://console.firebase.google.com/project/petsaude6/overview.
2. Em **Authentication → Sign-in method**, mantenha **Anônimo** habilitado (para participantes) e ative também **Email/Password** (para responsáveis).
3. Em **Authentication → Users**, clique para adicionar um usuário administrativo com seu próprio e-mail e uma senha forte. **Copie o UID** desse usuário.
4. Em **Firestore Database → Data**, crie uma coleção com ID `pet_grupo6_admins`, e um documento cujo ID seja **exatamente o UID** da conta criada. Insira o campo:
   - nome: `active`
   - tipo: **boolean**
   - valor: **true**
5. Em **Firestore Database → Rules**, cole o conteúdo atualizado do arquivo [firestore.rules](../firestore.rules) e clique em **Publish**.
6. Abra **https://99eliel.github.io/pet/admin.html** e entre com e-mail/senha. O login é **temporário, apenas nesta aba**: ao fechar/recarregar a página será necessário autenticar novamente.
7. Faça uma partida de teste até o final no tablet. Verifique no Firestore uma entrada em `pet_grupo6_tentativas` e teste o relatório.
8. Se desejar, faça um **reset de teste** (com a equipe avisada) e confira que o Top 5 foi zerado mas o relatório de **todas as edições** continua com a partida de teste.
9. Desligue o Wi-Fi, conclua outra partida, religue e aguarde a sincronização. Recarregue o relatório para conferir os resultados.

**Não é necessário colocar senha de administrador no código, no GitHub ou nesta conversa.** A autorização é feita com autenticação e UID cadastrado no Firestore. Para revogar acesso, ajuste o campo `active` para false ou remova o documento pelo Firebase Console.

### Alternativa para publicar as regras pelo terminal

Na pasta do repositório, com Firebase CLI autenticado:

~~~bash
firebase deploy --only firestore:rules --project petsaude6
~~~

Esse comando publica **as regras do banco**, não o site, e pode alterar o acesso de outros aplicativos do projeto. Leia o arquivo antes de publicar.

## 4. Estrutura técnica

| Arquivo / coleção | Finalidade |
|---|---|
| `admin.html` | Login, relatório, PDF/CSV, reset |
| `admin.js` | Autenticação, consultas, cálculos e alteração de edição |
| `admin.css` | Interface responsiva e impressão A4 |
| `app.js` | Captura das 10 respostas por partida concluída |
| `scores.js` | Ranking por edição, fila de envio offline e tentativas |
| `firestore.rules` | Leitura restrita do relatório, criação de tentativas e reset autorizado |
| `pet_grupo6_admins/{uid}` | Autorização manual do responsável |
| `pet_grupo6_controle/placar` | Identificador da edição ativa |
| `pet_grupo6_tentativas/{id}` | Partidas concluídas, sem nome da pessoa |
| `pet_grupo6_placares/{sessionId}/entradas/{id}` | Ranking das novas edições |
| `pet_grupo6_ranking/{id}` | Ranking antigo, preservado até primeiro reset |

As tentativas são registradas **inclusive quando a pontuação não supera o recorde anterior**. Sem isso, as taxas de erro ficariam distorcidas por avaliar somente os melhores resultados.

## 5. Checklist para a feira

- [ ] Regras novas publicadas e Email/Password habilitado.
- [ ] Conta administrativa criada e UID autorizado em `pet_grupo6_admins`.
- [ ] Relatório apresenta taxa de erro real após partidas de teste.
- [ ] Top 5 é compartilhado entre os dispositivos.
- [ ] Reset é bloqueado sem credenciais e requer confirmação.
- [ ] Após reset, Top 5 vazio e histórico do relatório preservado.
- [ ] Partida offline é sincronizada após retornar a conexão.
- [ ] PWA atualizado em todos os tablets.
