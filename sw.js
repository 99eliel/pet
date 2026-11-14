/* Funcionamento offline no tablet depois da primeira abertura online. */
const CACHE = 'pet-grupo6-feira-pwa-v19';
const PREFIX = 'pet-grupo6-';
const APP_FILES = [
  './', './index.html', './admin.html', './styles.css', './tablet.css', './admin.css',
  './theme.js', './app.js', './admin.js', './install.js', './qr.js', './fullscreen.js',
  './questions.js', './scores.js', './firebase-config.js',
  './assets/favicon.svg', './assets/logo-pet-vetorial.svg',
  './assets/icon-192.png', './assets/icon-512.png', './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
