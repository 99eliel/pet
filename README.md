# Quiz PET Saúde — Raízes Digitais

## Gestão do placar e relatório de erros

A tela inicial agora possui os botões **Gerar relatório** e **Zerar placar**, que abrem o painel restrito `admin.html`.

- **Zerar placar:** inicia uma nova edição, deixando o Top 5 vazio, sem apagar o histórico de respostas e as pontuações anteriores.
- **Gerar relatório:** calcula taxa de erro por pergunta, total de respostas, acertos e erros, e desempenho por LGPD/SUS. Oferece **Salvar como PDF** pela impressão do navegador e **CSV** para Excel.
- Os registros de erros são feitos **a partir desta versão e apenas para partidas concluídas**. Pontuações antigas não permitem identificar quais perguntas foram erradas.
- O painel exige conta autorizada do Firebase com e-mail/senha; a confirmação de reset exige digitar **ZERAR**.
- Os resultados analíticos são armazenados sem o nome do participante. O ranking público continua exibindo apenas os nomes/apelidos e pontos.

**ATIVAÇÃO OBRIGATÓRIA NO FIREBASE:** as novas regras **não** são publicadas automaticamente ao atualizar o GitHub. É necessário publicar o arquivo [firestore.rules](firestore.rules), habilitar autenticação por Email/Password e criar um documento administrativo de autorização no Firebase Console. Veja as instruções detalhadas em **[Administração e relatórios](docs/administracao-e-relatorios.md)** antes de utilizar as funções. O login anônimo dos participantes deve continuar habilitado.


> **Revisão das perguntas (12/11/2026):** as 40 questões passaram por revisão editorial de clareza. A orientação sobre suspeita de infarto agora cita o SAMU 192; alternativas e explicações foram ajustadas, e o sorteio evita assuntos repetidos na mesma partida. Confira [a revisão detalhada](docs/revisao-questoes.md). Os registros já existentes no ranking não foram apagados. Para atualizar o PWA instalado no tablet, abra-o conectado à internet e recarregue a página.


Quiz do PET Saúde para o tablet do estande, com **28 perguntas oficiais Sim/Não** e **12 perguntas complementares de múltipla escolha**, sobre LGPD e SUS.

**Ícone PET Saúde:** o arquivo `.ico` disponibilizado pela equipe também foi incorporado à identidade do aplicativo, com uma versão vetorial do símbolo em `assets/favicon.svg`. Ele é usado na aba do navegador, no cabeçalho e como opção de ícone escalável no manifesto PWA. A marca completa permanece no quiz e os ícones PNG anteriores continuam disponíveis para compatibilidade com Android/iOS.\n\n## Ajustes de acessibilidade para a feira — versão atual

Após as orientações do professor, a interface passou a priorizar o **uso da área inteira do tablet**, inclusive em tela cheia do PWA:

- Durante as perguntas, o topo e rodapé do site ficam ocultos e o cartão de jogo utiliza praticamente toda a largura e altura disponíveis.
- A fonte das questões, das explicações e dos botões **Sim/Não** e **A–D** foi ampliada para facilitar a leitura, especialmente por pessoas idosas.
- Foram removidos da tela de perguntas o relógio visível, a instrução redundante para selecionar respostas e a linha inferior com textos decorativos. O tempo continua sendo medido somente para a pontuação.
- A **logo PET Saúde** fornecida na conversa foi convertida em **SVG vetorial** e reposicionada entre nome do participante e pontuação, sem ocultar nomes longos.
- O título visível é **Quiz PET Saúde**, sem associação exclusiva a um único grupo. Na tela inicial, o rodapé reconhece a colaboração de Administração, Ciências Contábeis, Direito e Gestão da Tecnologia da Informação.
- O **tema escuro é o padrão**, com opção **Tema claro** na parte superior da tela inicial. A escolha é salva no próprio aparelho. A economia de bateria depende do tipo de tela do tablet.
- As **12 perguntas de múltipla escolha**, elaboradas para completar o formato do quiz, estão relacionadas em **[docs/perguntas-multipla-escolha.md](docs/perguntas-multipla-escolha.md)** com todas as alternativas, respostas e explicações para revisão da equipe.

O uso do PWA continua disponível, e o quiz mantém ranking Firebase, respostas sem tempo limite e retorno automático em cinco segundos após o resultado.

**Atualização em tablet já instalado:** abrir o PWA com conexão à internet, recarregar a página e conferir a versão; o service worker `pet-grupo6-feira-pwa-v10` armazena o novo CSS, o script de tema e a logo. Faça uma partida completa em modo claro/escuro e também com Wi-Fi desligado antes da feira.

## Regras do jogo
- A cada partida: 2 LGPD + 5 SUS (Sim/Não), mais 1 LGPD + 2 SUS (A–D).
- Ordem das questões e alternativas A–D é aleatória.
- **Não existe limite de tempo por pergunta.** O relógio conta apenas para definir o bônus de rapidez.
- Cada acerto vale **100 pontos + até 100 pontos de bônus**. O bônus diminui gradualmente, mas a pergunta nunca expira.
- Erros valem zero. Depois de cada resposta, o visitante lê uma explicação curta e toca para avançar.
- O resultado aparece por **5 segundos** antes de voltar automaticamente à tela inicial.
- Ranking Top 5 por pontuação; quando o nome se repete, a melhor partida é exibida.

## Firebase configurado
Projeto Firebase da organização: **petsaude6**.

- Hospedagem continua no **GitHub Pages**.
- Coleção de resultados Firestore: `pet_grupo6_ranking`.
- O aplicativo usa **Firebase Authentication anônimo**, sem exigir login do visitante.
- Ranking em tempo real, compartilhado entre os dispositivos conectados.
- Cada pontuação é salva imediatamente no tablet. Se a rede cair, uma fila local tenta enviar os registros ao Firebase quando a conexão volta.
- A tela informa se está conectada, sincronizando, offline ou com erro.
- Pontuações de versões antigas **não são importadas automaticamente** para o ranking oficial, evitando misturar testes.

A configuração do SDK está em `firebase-config.js`. A chave da configuração Web **não é uma chave administrativa**: a proteção depende das regras do Firestore e Authentication.

### Passos obrigatórios no Console Firebase
**Adicionar a configuração web no GitHub NÃO cria um banco nem publica as regras automaticamente.** É necessário:

1. Abrir o projeto: https://console.firebase.google.com/project/petsaude6/overview
2. Em **Build → Firestore Database**, selecionar **Create database** se ainda não existir. Escolher uma região adequada e inicializar com regras bloqueadas (modo de produção).
3. Em **Build → Authentication → Sign-in method**, habilitar **Anonymous (Anônimo)**.
4. Em **Firestore Database → Rules**, substituir o conteúdo pelas regras de `firestore.rules` do repositório e clicar em **Publish**.
5. Em **Authentication → Settings → Authorized domains**, conferir `99eliel.github.io` caso o seu método de login exija autorização de domínio.
6. Abrir o site https://99eliel.github.io/pet/ no tablet com internet e recarregar.
7. Confirmar na tela a mensagem **Firebase conectado**, completar uma partida e verificar que um documento foi criado na coleção `pet_grupo6_ranking` do Firestore.
8. Abrir a página em outro navegador/aparelho e confirmar que o Top 5 é compartilhado.
9. Testar offline: desativar Wi-Fi, responder, reativar Wi-Fi e conferir a sincronização.

Se aparecer “Firebase indisponível” ou “Conectando” sem finalizar, confira o projeto, Authentication anônimo, Firestore, regras e rede. O quiz continuará jogável e os novos resultados ficarão guardados localmente.

### Alternativa: publicar regras pelo Firebase CLI
Os arquivos `.firebaserc` e `firebase.json` já apontam para o projeto e para as regras. No terminal local dentro do repositório:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project petsaude6
```

**Cuidado:** esse comando substitui as regras do Firestore desse projeto. Confira se não há outros sistemas usando o mesmo banco. Não é necessário publicar a hospedagem no Firebase.

### Segurança e privacidade
- As regras limitam consultas e exigem autenticação anônima, UID correspondente, campos esperados, pontuação coerente e data de criação do servidor.
- O site público mostra **nome/apelido e pontos**. Oriente a usar apelidos, não dados de saúde, CPF ou telefones.
- A pontuação é calculada no navegador. **Não é possível impedir fraude deliberada apenas com essas regras.** Uma competição com premiação importante precisaria validar perguntas, respostas e tempo no servidor.
- Analytics **não está inicializado**: ele é opcional e não é necessário para o ranking, mesmo com `measurementId` na configuração.

### Uso offline
Abra a página com internet uma vez após a atualização e mantenha os arquivos do site em cache. Se a internet cair, o jogo funciona e a pontuação fica guardada no tablet até reconectar. Não use modo anônimo nem limpe dados do site. Teste o modo offline antes da feira. O sistema operacional pode apagar dados/cache em certas condições; sincronizar com o Firestore é mais seguro.

### GitHub Pages
Para publicar, abra **Settings → Pages → Deploy from a branch → main → /(root)**.
Site previsto: https://99eliel.github.io/pet/

## Arquivos
| Arquivo | Uso |
|---|---|
| `index.html` | Telas do jogo |
| `styles.css` | Interface responsiva/tablet |
| `questions.js` | 40 questões, temas e configuração |
| `app.js` | Sorteio, tempo livre, pontos, resultado |
| `scores.js` | Ranking Firebase com backup local |
| `firebase-config.js` | Configuração web do Firebase petsaude6 |
| `firestore.rules` | Regras a publicar no Firebase |
| `firebase.json`, `.firebaserc` | Configuração para Firebase CLI |
| `sw.js` | Suporte offline |
| `assets/logo-pet.svg` | Logo original do PET Saúde |


## Instalação como aplicativo (PWA)

O quiz agora é um **Progressive Web App** instalável no Android, Windows e outros navegadores compatíveis. Também pode ser adicionado à tela inicial de iPhones e iPads.

**Pelo botão do site:** abra https://99eliel.github.io/pet/ e toque em **Instalar aplicativo** na tela inicial. Se o Chrome ou Edge disponibilizar o evento nativo de instalação, a janela oficial do navegador será aberta. Se o navegador não oferecer esse evento, o botão mostrará orientações específicas. Quando o app já está aberto em modo instalado, o botão fica oculto.

- **Android (Chrome):** use o botão, confirme a instalação. Se a confirmação não aparecer, toque no menu ⋮ e escolha **Instalar app** ou **Adicionar à tela inicial**.
- **iPhone/iPad (Safari):** abra o site no Safari, toque em **Compartilhar**, depois **Adicionar à Tela de Início**.
- **Windows (Chrome/Edge):** use o botão ou o ícone de instalação na barra de endereços.
- O app instalado tem ícone próprio **PET Saúde**, abre sem barra de endereço e usa a mesma base de perguntas.
- O **manifest** inclui ícones PNG de 192x192 e 512x512 pixels, nome, cor e escopo do GitHub Pages.
- O **service worker** armazena páginas, scripts, questões, estilos e imagens. Para usar offline, abra o site **com internet ao menos uma vez**, aguarde a carga e **teste com o Wi-Fi desligado** antes da feira.
- O **ranking Firebase só sincroniza quando houver internet**; partidas offline ficam no armazenamento local e serão enviadas depois, desde que os dados não sejam apagados.

Os arquivos relevantes são \`manifest.webmanifest\`, \`install.js\`, \`sw.js\` e \`assets/icon-{192,512}.png\`. A instalação exige que o site seja servido por **HTTPS**; o GitHub Pages fornece HTTPS.

**Após alterar o PWA:** se o botão não aparecer, recarregue o site com internet e aguarde a atualização do service worker. Se o app já estiver instalado, o botão fica escondido por padrão. Caso o navegador ainda não ofereça o prompt automático, o botão continuará apresentando instruções manuais.
