/**
 * Instalação PWA — usa o convite nativo quando disponível.
 * Em iOS/iPadOS e navegadores sem beforeinstallprompt, fornece instruções.
 * A instalação NÃO exige login ou acesso ao Firebase.
 */
const button = document.getElementById('installAppButton');
const dialog = document.getElementById('installHelpDialog');
const helpTitle = document.getElementById('installHelpTitle');
const helpIntro = document.getElementById('installHelpIntro');
const helpSteps = document.getElementById('installHelpSteps');
const closeButton = document.getElementById('installHelpClose');
const status = document.getElementById('installAppStatus');

let installPrompt = null;
const userAgent = navigator.userAgent || '';
const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(userAgent);

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.matchMedia('(display-mode: fullscreen)').matches
    || navigator.standalone === true;
}

function updateInstallState() {
  if (!button) return;
  button.hidden = isStandalone();
}

function message(text) {
  if (!status) return;
  status.textContent = text;
}

function showHelp() {
  if (!dialog) return;
  helpSteps.replaceChildren();
  let steps = [];
  if (isIOS) {
    helpTitle.textContent = 'Instalar no iPhone ou iPad';
    helpIntro.textContent = 'Em aparelhos Apple, adicione o quiz à Tela de Início pelo navegador.';
    steps = [
      'Abra este site no Safari.',
      'Toque no botão Compartilhar (quadrado com seta para cima).',
      'Escolha “Adicionar à Tela de Início” e confirme em “Adicionar”.'
    ];
  } else if (isAndroid) {
    helpTitle.textContent = 'Instalar no tablet ou celular Android';
    helpIntro.textContent = 'O navegador ainda não liberou a instalação automática. Você pode instalar pelo menu.';
    steps = [
      'Abra este site no Chrome, com internet, e atualize a página.',
      'Toque no menu de três pontos (⋮).',
      'Selecione “Instalar app” ou “Adicionar à tela inicial” e confirme.'
    ];
  } else {
    helpTitle.textContent = 'Instalar no computador';
    helpIntro.textContent = 'A instalação depende do navegador utilizado.';
    steps = [
      'Abra este site no Chrome ou Microsoft Edge.',
      'Procure o ícone de instalação na barra de endereços ou no menu (⋮).',
      'Selecione “Instalar Quiz PET 6” e confirme. No Safari do Mac, use Arquivo → Adicionar ao Dock.'
    ];
  }
  for (const text of steps) {
    const item = document.createElement('li');
    item.textContent = text;
    helpSteps.append(item);
  }
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

button?.addEventListener('click', async () => {
  if (isStandalone()) {
    updateInstallState();
    return;
  }
  if (!installPrompt) {
    showHelp();
    return;
  }
  const prompt = installPrompt;
  installPrompt = null;
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice?.outcome === 'accepted') {
      message('Instalação solicitada. Confirme as opções do navegador.');
    } else {
      message('Você pode instalar quando quiser.');
    }
  } catch (error) {
    console.warn('Convite de instalação não disponível:', error);
    showHelp();
  }
});

closeButton?.addEventListener('click', () => {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
});

dialog?.addEventListener('click', event => {
  if (event.target === dialog && typeof dialog.close === 'function') dialog.close();
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  updateInstallState();
  message('Este dispositivo está pronto para instalar o aplicativo.');
});

window.addEventListener('appinstalled', () => {
  installPrompt = null;
  updateInstallState();
  message('Aplicativo instalado com sucesso!');
});

// Alguns navegadores não emitem appinstalled: atualize quando o modo mudar.
window.matchMedia('(display-mode: standalone)').addEventListener?.('change', updateInstallState);
updateInstallState();
