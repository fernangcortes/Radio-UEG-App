const CACHE_NAME = 'radio-ueg-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/brand/logo-radio-ueg-white.png',
  '/assets/brand/logo-crialab-white.png',
  '/assets/brand/logo-ueg-white.png',
  '/assets/brand/logo-crialab-color.png',
  '/assets/programs/sintonia-cover.png',
  '/assets/programs/sintonia-logo.png',
  '/assets/programs/reitor-cover.png',
  '/assets/programs/reitor-logo.png',
  '/assets/programs/sunset-cover.png',
  '/assets/programs/fabular-cover.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('zeno.fm')) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
