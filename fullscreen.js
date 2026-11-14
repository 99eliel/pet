/**
 * Quiz PET Saúde — modo de tela cheia, independente do Firebase.
 *
 * Só solicita fullscreen após o clique do usuário; nunca força a entrada
 * automaticamente ou modifica o estado das perguntas/pontuações.
 */
const buttons = Array.from(document.querySelectorAll('[data-fullscreen-toggle]'));
const notice = document.getElementById('fullscreenStatus');
let noticeTimeout = null;

function isFullscreen() {
  return Boolean(document.fullscreenElement);
}

function updateButtons() {
  const active = isFullscreen();
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Ativar tela cheia');
    button.title = active ? 'Sair da tela cheia' : 'Ativar tela cheia';
    const icon = button.querySelector('[data-fullscreen-icon]');
    const label = button.querySelector('[data-fullscreen-label]');
    if (icon) icon.textContent = active ? '⊟' : '⛶';
    if (label) label.textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
  }
}

function showNotice(message) {
  if (!notice) return;
  clearTimeout(noticeTimeout);
  notice.textContent = message;
  notice.hidden = false;
  noticeTimeout = setTimeout(() => { notice.hidden = true; }, 6500);
}

async function toggleFullscreen() {
  try {
    if (isFullscreen()) {
      if (typeof document.exitFullscreen === 'function') {
        await document.exitFullscreen();
      }
      return;
    }

    const element = document.documentElement;
    if (typeof element.requestFullscreen !== 'function' || document.fullscreenEnabled === false) {
      showNotice('Este navegador não permite tela cheia pelo botão. Instale o PWA e abra pelo ícone na tela inicial do tablet.');
      return;
    }

    // O navegador pode ocultar barras próprias; algumas barras do Android
    // continuam sob controle do sistema operacional.
    await element.requestFullscreen({ navigationUI: 'hide' });
  } catch (error) {
    console.warn('Não foi possível entrar/sair de tela cheia:', error);
    showNotice('Tela cheia indisponível neste navegador. Você pode instalar o quiz como aplicativo para usar mais área da tela.');
  } finally {
    updateButtons();
  }
}

for (const button of buttons) {
  button.addEventListener('click', toggleFullscreen);
}

document.addEventListener('fullscreenchange', updateButtons);
document.addEventListener('fullscreenerror', () => {
  showNotice('O tablet não autorizou a tela cheia. Use o aplicativo instalado ou tente abrir no Chrome.');
  updateButtons();
});
document.addEventListener('visibilitychange', updateButtons);
updateButtons();
