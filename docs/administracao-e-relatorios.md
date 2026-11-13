# Quiz PET Saúde — Relatórios e zerar placar

## Acesso simples para a feira

Abra **https://99eliel.github.io/pet/admin.html**, digite a senha numérica **00000000** e clique em **Entrar no painel**.

Não há cadastro de e-mail, UID administrativo nem autorização de aparelho. O Firebase usa autenticação **anônima automática**, sem telas adicionais, para identificar as conexões do aplicativo.

Os botões **Gerar relatório** e **Zerar placar** estão abaixo do Top 5 na página inicial.

### Configuração no Firebase

A configuração é feita somente uma vez e não exige nenhum cadastro de administrador:

1. Em https://console.firebase.google.com/project/petsaude6/authentication/providers, mantenha habilitado **Anonymous (Anônimo)**.
2. Abra https://console.firebase.google.com/project/petsaude6/firestore/rules.
3. Copie todo o conteúdo atualizado de [firestore.rules](../firestore.rules), substitua as regras do projeto **se ele for exclusivo do quiz** e clique em **Publicar**.
4. Abra o quiz e faça uma partida completa. Em seguida, entre no painel com **00000000** e confirme se as estatísticas aparecem.

Não é necessário criar a coleção `pet_grupo6_admins`. Se ela já existir, não é utilizada pelo painel atual; não é preciso excluí-la.

**Atenção:** a publicação do GitHub não publica as regras do Firestore automaticamente. Sem publicá-las, o relatório e o reset poderão apresentar `permission-denied`.

## Relatório da feira

Cada partida concluída registra na coleção `pet_grupo6_tentativas` as dez questões sorteadas, se foram acertadas, tempo gasto e a **idade opcional**.

O relatório mostra:
- número de partidas completas;
- total de respostas, acertos e erros;
- taxa de erro por pergunta e por tema (LGPD e SUS);
- média de idade entre as partidas que informaram idade;
- média de idade de quem errou cada questão;
- relatórios de **todas as edições** ou somente da **edição atual**.

A exportação **PDF** abre a impressão do navegador (escolha **Salvar como PDF**). O botão **CSV** baixa uma tabela para Excel.

As perguntas são sorteadas, portanto cada uma tem quantidades diferentes de respostas. Compare taxa de erro e tamanho da amostra. As médias representam **partidas**, não pessoas únicas; esse levantamento descreve quem participou da feira, não toda a população.

Registros antigos sem detalhes das respostas não podem gerar estatísticas retrospectivas. Idades não informadas nunca entram no cálculo da média.

## Zerar placar

Clique em **Zerar placar**, entre com a senha, digite **ZERAR** e confirme a ação no navegador. É necessário estar conectado à internet.

O reset cria outra edição no documento `pet_grupo6_controle/placar`, de modo que o Top 5 da nova edição fica vazio. As partidas e rankings antigos não são apagados. O filtro **Todas as edições** continua permitindo análise histórica.

Evite reiniciar o placar enquanto alguém está fazendo a prova: partidas em andamento permanecem ligadas à edição em que começaram.

## Privacidade e limites de segurança desta versão

Esta versão foi propositalmente simplificada para um evento pontual. A senha `00000000` fica no código público do site e **não é uma proteção de servidor**.

Ao eliminar a autorização administrativa, as regras precisam permitir que usuários autenticados anonimamente:
- consultem registros de respostas, incluindo idades opcionais armazenadas em `pet_grupo6_tentativas`;
- atualizem o documento de controle para iniciar outra edição.

**Consequência:** qualquer pessoa com conhecimentos técnicos pode acessar esses registros ou reiniciar o placar diretamente pela API do Firebase, sem digitar a senha da interface. As estatísticas da tela não exibem nomes, e o registro analítico não guarda o nome, mas **idades e padrões individuais de resposta ficam tecnicamente acessíveis**. Não trate o PIN como controle de acesso real.

Para reduzir exposição durante a feira, oriente a usar apelidos e a deixar a idade em branco quando não quiser informá-la. **Depois do evento, feche as regras de leitura/gravação ou desative a coleção**. Se a coleta exigir confidencialidade, é necessário voltar a uma solução com permissões reais no servidor.

As regras continuam verificando o formato dos resultados, protegendo contra edição/exclusão de respostas já registradas e limitando o número de registros retornados por consulta.

## Testes recomendados

1. Abra o painel em outro navegador e confira que só a senha é pedida.
2. Faça partidas com e sem idade no tablet e por QR Code no celular.
3. Confira o relatório em PDF e CSV; idades em branco devem ser ignoradas na média.
4. Faça um reset de teste e verifique Top 5 vazio e histórico preservado.
5. Teste a sincronização de uma partida offline depois de religar o Wi-Fi.

O PWA e o GitHub Pages continuam sendo usados normalmente.
