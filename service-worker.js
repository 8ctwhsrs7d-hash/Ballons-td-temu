const CACHE_NAME = 'btd-arena-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.webmanifest',
  // Add other critical assets here if needed.
  // Note: External resources like Google Fonts or CDN scripts are fetched via the network.
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
