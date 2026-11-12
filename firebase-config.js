/**
 * Cole aqui o objeto de configuração WEB do seu projeto Firebase quando
 * desejar um ranking compartilhado entre todos os aparelhos.
 *
 * Exemplo:
 * export const firebaseConfig = {
 *   apiKey: '...',
 *   authDomain: 'seu-projeto.firebaseapp.com',
 *   projectId: 'seu-projeto',
 *   appId: '...'
 * };
 *
 * O quiz continua funcionando SEM Firebase, com ranking local.
 * Para habilitar o ranking geral é necessário também:
 * 1. Publicar as perguntas oficiais e definir isDemo: false em questions.js;
 * 2. Habilitar Authentication > Anonymous no Firebase;
 * 3. Criar Firestore e aplicar firestore.rules;
 * 4. Definir domínios autorizados em Authentication.
 *
 * ATENÇÃO: regras de Firestore validam o FORMATO dos resultados, mas não
 * conseguem verificar se o jogador acertou honestamente. Para competição
 * com prêmios, pontuação deve ser validada em um backend confiável.
 */
export const firebaseConfig = null;
