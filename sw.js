const CACHE_NAME = 'imobadmin-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/db.js',
  '/js/components.js',
  '/js/dashboard.js',
  '/js/properties.js',
  '/js/tenants.js',
  '/js/contracts.js',
  '/js/finances.js',
  '/js/crm.js',
  '/js/calendar.js',
  '/js/app.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('chrome-extension') || event.request.url.includes('cdn.jsdelivr.net')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
