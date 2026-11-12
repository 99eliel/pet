# Quiz do Grupo 6 — PET Saúde

Quiz para uso em **um tablet no estande da feira**. O visitante informa seu primeiro nome ou apelido, responde e disputa as cinco melhores posições do ranking.

## Fluxo do participante

1. A tela inicial mostra título, identidade visual, Top 5 e botão de início.
2. O visitante informa seu nome/apelido.
3. O programa sorteia **7 perguntas Sim/Não e 3 de múltipla escolha A–D** a cada partida. A ordem das questões é aleatória, assim como a ordem das alternativas A–D; os botões Sim e Não permanecem na mesma posição.
4. Cada pergunta tem **15 segundos**; acertar rápido vale mais.
5. Depois de cada resposta, aparece a resposta correta, uma justificativa de aproximadamente duas linhas e o botão de avançar. O cronômetro fica parado nessa explicação.
6. Ao terminar, aparecem pontos, acertos, tempo e colocação.
7. O botão **Próximo participante** limpa o nome para a próxima pessoa. Sem interação, o resultado retorna à tela inicial após **60 segundos**.

## Pontuação

- **Acerto:** 100 pontos fixos + até 100 pontos de bônus proporcionais ao tempo restante.
- **Erro/tempo esgotado:** 0 pontos.
- **Máximo:** 2.000 pontos por partida.
- **Desempate:** menor tempo acumulado de respostas.
- Cada nome aparece com a melhor pontuação.

A dificuldade pode variar se as perguntas forem sorteadas de um banco de dificuldade desigual; idealmente, as perguntas oficiais devem ser equivalentes.

## Banco de perguntas

**As 24 perguntas deste protótipo são apenas exemplos:** 14 Sim/Não e 10 de alternativas A–D. NÃO são conteúdo oficial do Grupo 6.

Para inserir as perguntas oficiais, edite o arquivo **questions.js**. Exemplo de item:

~~~javascript
{
  id: 'sn01',
  type: 'boolean',
  prompt: 'Enunciado da pergunta?',
  options: ['Sim','Não'],
  correctIndex: 0, // Sim=0; Não=1
  explanation: 'Uma justificativa breve após responder.'
}
~~~

Múltipla escolha usa type='multiple', quatro opções e correctIndex de 0 (A) a 3 (D). A justificativa deve ter aproximadamente duas linhas.

Quando as perguntas oficiais estiverem revisadas, altere isDemo para false e questionSetVersion para, por exemplo, feira-oficial-v1.

## Logo do evento

A interface procura a imagem original em **assets/logo-pet.png**. Quando esse arquivo existir, o site substitui a identidade temporária automaticamente. Essa imagem ainda precisa ser anexada ao repositório na forma PNG.

## Como publicar e usar no tablet

1. Abra **Settings → Pages** no repositório do GitHub.
2. Selecione **Deploy from a branch**, branch **main**, diretório **/(root)** e salve.
3. Depois de publicado, acesse **https://99eliel.github.io/pet/**.
4. Abra no tablet, com internet, até que a primeira carga seja concluída.
5. A partir daí, o app pode funcionar **offline** por meio do service worker, desde que os dados do navegador sejam preservados.
6. Se desejado, use no Chrome **Adicionar à tela inicial** e a opção de fixação de tela do sistema do tablet para manter a página visível.

Durante a feira: mantenha o tablet carregando, evite modo anônimo, não limpe os dados do site e teste a partida completa com Wi-Fi desligado antes de abrir o estande.

## Ranking do tablet

Por padrão, o Top 5 é salvo localmente no navegador do **mesmo tablet**, sem necessidade de internet ou banco de dados. O ranking é persistente enquanto o armazenamento do site não for apagado. A versão de demonstração usa armazenamento separado dos resultados oficiais.

## Ranking online (opcional)

A estrutura para Firestore está preparada em **scores.js** e **firebase-config.js**. Para um ranking compartilhado entre vários aparelhos é necessário:

- Configurar aplicativo Web no Firebase e inserir a configuração em firebase-config.js.
- Criar Cloud Firestore e publicar as regras do arquivo firestore.rules.
- Habilitar Authentication com login anônimo e autorizar os domínios.
- Publicar as perguntas oficiais e marcar isDemo como false.

**Atenção:** uma competição com prêmio relevante deve validar pontuação e tempo no servidor para evitar falsificação, pois a lógica atual de pontuação é executada no navegador.

## Arquivos

- index.html — telas e componentes.
- styles.css — interface e adaptação ao tablet.
- app.js — temporizador, sorteio, jogo e resultados.
- questions.js — perguntas, justificativas e regras.
- scores.js — ranking local e online opcional.
- firebase-config.js — configuração opcional do Firebase.
- firestore.rules — regras do Firestore.
- sw.js e manifest.webmanifest — funcionamento offline e modo aplicativo.
- assets/favicon.svg — ícone temporário.
