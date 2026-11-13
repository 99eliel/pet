# Administração, reset do placar e relatório de desempenho — PET Saúde

Este documento descreve a nova interface disponível em:

**https://99eliel.github.io/pet/admin.html**

Na tela inicial do quiz, na seção do Top 5, aparecem os botões **Gerar relatório** e **Zerar placar**. Ambos pedem a senha do evento e exigem um navegador autorizado uma única vez no Firebase.

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

A ação exige senha de acesso, navegador autorizado e digitar **ZERAR**, além de uma confirmação final. É preciso estar conectado à internet. Todos os tablets online atualizam automaticamente ao receber o novo ID da edição no Firestore.

**Cuidado:** não utilize o reset enquanto um participante estiver respondendo. O sistema guarda a edição em que a pessoa começou, de modo que uma partida iniciada antes do reset pertença à edição anterior.

## 3. Administração com senha única, sem e-mail

**Senha usada no evento: `00000000`.** Abra https://99eliel.github.io/pet/admin.html, informe os oito números e entre no painel. Não existe campo para e-mail.

### Autorizar o navegador uma única vez

**É necessário liberar uma única vez o navegador da equipe no Firebase.** Isso protege o reset e as idades registradas no relatório. Depois, o acesso ao painel pede somente a senha.

1. Em **Authentication → Sign-in method** no projeto `petsaude6`, mantenha o provedor **Anônimo (Anonymous)** habilitado. **Não precisa criar usuário de e-mail/senha.**
2. Publique o arquivo [firestore.rules](../firestore.rules) em **Firestore Database → Rules**, se ainda não estiver publicado.
3. No navegador que a equipe usará para gerar relatórios, abra **https://99eliel.github.io/pet/admin.html**, digite **00000000** e clique em **Entrar no painel**.
4. Na primeira visita, aparecerá a tela **Autorizar este aparelho uma vez**. Clique em **Copiar identificador**.
5. Em **Firestore Database → Dados**, crie a coleção `pet_grupo6_admins`, se não existir. Crie um documento com ID igual ao **identificador copiado** e adicione um campo `active` com tipo **boolean** e valor **true**.
6. Volte ao painel e clique em **Já autorizei, verificar**. O relatório e o reset serão liberados.
7. Nas próximas visitas **nesse mesmo navegador e perfil**, basta digitar **00000000**. O UID anônimo é mantido pelo Firebase no armazenamento do navegador. Se os dados do site forem apagados ou o acesso ocorrer em outro navegador, será necessário autorizar o novo UID.

Para revogar o acesso, altere o campo `active` para **false** no Firestore. O botão **Bloquear painel** exige a senha novamente, sem perder a identidade do navegador autorizado.

**Limitação importante:** a senha `00000000` está no código público do site, portanto não é uma credencial criptograficamente segura. A restrição real dos dados vem das regras do Firestore e do UID autorizado. Por isso, prefira usar o painel administrativo **no celular ou computador da equipe, nunca em um tablet deixado livre para visitantes**. Não compartilhe o UID autorizado.

### Testar a integração

1. Faça uma partida até o fim. Confira no Firestore a coleção `pet_grupo6_tentativas` e abra o relatório.
2. Se desejar, faça um reset de teste, com a equipe avisada. O Top 5 da edição ficará vazio, mas o relatório **Todas as edições** manterá o histórico.
3. Para verificar sincronização, jogue offline no tablet, religue o Wi-Fi e atualize o relatório no painel.

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

- [ ] Regras publicadas e Authentication anônimo habilitado.
- [ ] Navegador da equipe autorizado com UID em `pet_grupo6_admins`.
- [ ] Relatório apresenta taxa de erro real após partidas de teste.
- [ ] Top 5 é compartilhado entre os dispositivos.
- [ ] Reset é bloqueado sem credenciais e requer confirmação.
- [ ] Após reset, Top 5 vazio e histórico do relatório preservado.
- [ ] Partida offline é sincronizada após retornar a conexão.
- [ ] PWA atualizado em todos os tablets.
