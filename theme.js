/* Alternador claro/escuro, salvo no tablet. O tema escuro é o padrão. */
(() => {
  const key = 'pet-saude-tema-v1';
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeToggleIcon');
  const label = document.getElementById('themeToggleLabel');

  let theme = 'dark';
  try {
    if (localStorage.getItem(key) === 'light') theme = 'light';
  } catch { /* Navegador sem armazenamento: permanece escuro. */ }

  function apply(nextTheme) {
    theme = nextTheme === 'light' ? 'light' : 'dark';
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    if (toggle) {
      toggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
      toggle.setAttribute('title', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
      toggle.setAttribute('aria-pressed', String(!isDark));
    }
    if (icon) icon.textContent = isDark ? '☀' : '☾';
    if (label) label.textContent = isDark ? 'Tema claro' : 'Tema escuro';

    let meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? '#091b22' : '#edf3f1';
  }

  apply(theme);
  toggle?.addEventListener('click', () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(key, next); } catch { /* Sem armazenamento */ }
  });
})();