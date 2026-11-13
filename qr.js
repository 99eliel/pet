/**
 * QR Code do Quiz PET Saúde.
 * O conteúdo foi pré-codificado em matriz QR (ECC M) para o endereço
 * público https://99eliel.github.io/pet/. Renderização SVG local,
 * sem serviço externo ou dependência de internet no tablet.
 * O celular do visitante precisa de internet para abrir o site.
 */
const QUIZ_LINK = 'https://99eliel.github.io/pet/';
const MATRIX = [
  '0000000000',
  '0000000000',
  '0000000000',
  '0000000000',
  '01fda0d7f0',
  '0104a1b410',
  '01747ba5d0',
  '01756745d0',
  '01758dc5d0',
  '01052e6410',
  '01fd5557f0',
  '000194d000',
  '01173faf90',
  '00cb50c7f0',
  '01273e4a10',
  '00b05bc5b0',
  '011c28d820',
  '013a4dc7f0',
  '01fdd144d0',
  '017a64d430',
  '01df5fa820',
  '01026007b0',
  '00141e9050',
  '0069cb8f30',
  '01f5589f90',
  '0001bd7110',
  '01fdb1f5d0',
  '0104a4f120',
  '0175cebfb0',
  '0174b00220',
  '0174b2eaf0',
  '0104bc9030',
  '01fdcad420',
  '0000000000',
  '0000000000',
  '0000000000',
  '0000000000'
];

const dialog = document.getElementById('qrDialog');
const openButton = document.getElementById('openQrButton');
const closeButton = document.getElementById('closeQrButton');
const qrContainer = document.getElementById('quizQrImage');
const copyButton = document.getElementById('copyQuizLink');
const copyMessage = document.getElementById('qrCopyMessage');

function makeQR() {
  const size = MATRIX.length;
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
  svg.setAttribute('width', '420');
  svg.setAttribute('height', '420');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('shape-rendering', 'crispEdges');
  const white = document.createElementNS(namespace, 'rect');
  white.setAttribute('width', String(size));
  white.setAttribute('height', String(size));
  white.setAttribute('fill', '#fff');
  svg.append(white);
  const black = document.createElementNS(namespace, 'path');
  black.setAttribute('fill', '#061719');
  let pathData = '';
  for (let y = 0; y < size; y++) {
    const row = BigInt('0x' + MATRIX[y]);
    let x = 0;
    while (x < size) {
      const hasPixel = index => ((row >> BigInt(size - 1 - index)) & 1n) === 1n;
      if (!hasPixel(x)) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && hasPixel(x)) x++;
      const width = x - start;
      pathData += 'M' + start + ' ' + y + 'h' + width + 'v1h-' + width + 'z';
    }
  }
  black.setAttribute('d', pathData);
  svg.append(black);
  return svg;
}

openButton?.addEventListener('click', () => {
  if (!dialog || !qrContainer) return;
  if (!qrContainer.firstElementChild) qrContainer.append(makeQR());
  if (copyMessage) copyMessage.textContent = '';
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  closeButton?.focus();
});

function closeDialog() {
  if (typeof dialog?.close === 'function') dialog.close();
  else dialog?.removeAttribute('open');
}

closeButton?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener('close', () => openButton?.focus());

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(QUIZ_LINK);
    copyMessage.textContent = 'Link copiado!';
  } catch {
    copyMessage.textContent = 'Não foi possível copiar. Use o link exibido abaixo.';
  }
});
