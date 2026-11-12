# Quiz do Grupo 6 — PET Saúde

Quiz para **um tablet no estande da feira**, com foco em **Privacidade e Proteção de Dados na Saúde (LGPD)** e **Conhecendo o SUS e os Serviços de Saúde**.

## Conteúdo do quiz

- **28 perguntas oficiais Sim ou Não**, fornecidas pela equipe da feira:
  - 8 do tema **LGPD**;
  - 20 do tema **SUS**.
- **12 perguntas complementares de múltipla escolha A–D**, elaboradas a partir dos mesmos temas:
  - 4 sobre **LGPD**;
  - 8 sobre **SUS**.
- As perguntas complementares são **criadas para completar o formato** e devem receber revisão da organização antes do evento. As explicações das 28 oficiais foram mantidas conforme o texto enviado.
- Perguntas e configurações estão em [questions.js](questions.js). O conteúdo pode ser alterado sem modificar o restante da interface.

## Cada participante

1. Abre a tela inicial com a logo fornecida, o nome do quiz e o ranking Top 5.
2. Toca em **Iniciar desafio** e informa nome/apelido.
3. Recebe dez perguntas **sorteadas a cada partida**, com:
   - **2 LGPD + 5 SUS**, todas de Sim/Não;
   - **1 LGPD + 2 SUS**, todas de múltipla escolha A–D.
4. As dez perguntas aparecem em **ordem aleatória**. Nas perguntas A–D, as alternativas também são embaralhadas; os botões Sim/Não ficam na posição habitual.
5. Pode responder **sem limite de tempo**: o cronômetro conta para cima, mas nunca encerra a pergunta. Ele é interrompido assim que a pessoa responde.
6. Depois de responder (ou esgotar o tempo), vê **a resposta correta e uma explicação breve**. Toca em **Próxima pergunta** para avançar.
7. Ao terminar, recebe a pontuação, número de acertos, tempo gasto e colocação.
8. **Próximo participante** limpa o nome e começa outro atendimento. Se não houver interação, a tela de resultados retorna à inicial em **5 segundos**.

### Pontuação

- Acerto = **100 pontos + bônus de até 100 pontos** que diminui suavemente com o tempo da resposta. Mesmo demorando, o participante pode responder e receber os 100 pontos fixos.
- Resposta errada = **zero**. Não existe tempo esgotado.
- Máximo por partida = **2.000 pontos**.
- Desempate: **menor tempo total de respostas**.
- Ranking Top 5 mostra a melhor pontuação por **nome/apelido**. Para pessoas distintas com nome igual, recomende usar um apelido diferente.

## Dados, ranking e funcionamento offline

O **ranking é armazenado apenas no próprio tablet** através de localStorage. Não há necessidade de Wi-Fi ou servidor de banco de dados durante a feira, depois que a página e seus arquivos forem baixados pela primeira vez.

O projeto possui integração **opcional** com Firestore para ranking entre aparelhos, porém ela está **desativada** enquanto `firebase-config.js` não estiver configurado. A competição local NÃO envia o nome do participante a um servidor de ranking. Como GitHub Pages é um site público, evite digitar dados pessoais sensíveis.

**Cuidados na feira:** não use aba anônima; não limpe os dados do navegador; mantenha o mesmo tablet/perfil e, se possível, faça uma cópia do ranking antes de trocar de aparelho. A lógica de pontuação fica no navegador; para concursos com prêmios de alto valor, seria necessário verificar a pontuação no servidor.

## Publicar no GitHub Pages

1. Abra **Settings → Pages** no repositório.
2. Em *Build and deployment*, selecione **Deploy from a branch**, a branch **main** e a pasta **/(root)**.
3. Abra **https://99eliel.github.io/pet/** quando o GitHub Pages finalizar a publicação.
4. Abra a página no tablet com internet **uma vez depois desta atualização** para carregar perguntas, CSS e logo novos.
5. Depois disso, o serviço offline permite jogar sem internet, desde que o navegador mantenha o cache e o armazenamento.
6. Recomenda-se usar **Adicionar à tela inicial** e o modo de fixação de tela do tablet para não deixar o participante sair do site.

O logotipo que a equipe enviou está em **assets/logo-pet.svg**. É uma versão otimizada da imagem fornecida, para carregamento leve.

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `questions.js` | 40 questões (28 oficiais + 12 complementares), temas, sorteio, acertos e explicações |
| `app.js` | Cronômetro, pontuação, perguntas, respostas e transições |
| `scores.js` | Ranking e armazenamento persistente local |
| `index.html` | Telas e elementos do quiz |
| `styles.css` | Visual responsivo e controles grandes para tablet |
| `assets/logo-pet.svg` | Logotipo fornecido pela organização |
| `sw.js` | Cache para funcionamento offline |
| `manifest.webmanifest` | Adicionar à tela inicial |
| `firebase-config.js` | Configuração opcional de ranking multiaparelhos |

## Revisão antes da feira

- Validar as **12 questões complementares A–D** e as respectivas explicações com a organização.
- Fazer partidas completas no tablet para confirmar tamanho dos textos e botões.
- Verificar que o ranking abre vazio no aparelho do evento e resiste a fechar/reabrir o navegador.
- Fazer o teste offline **com o Wi-Fi desligado**, após primeiro carregamento online.
- Verificar as explicações após cada resposta e que o resultado aparece por cinco segundos antes do retorno ao início.
