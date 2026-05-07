const APP_VERSION = '3';
const CACHE_NAME = `todo-pwa-v${APP_VERSION}`;
const ASSETS = [
  './to-do.html',
  './to-do.css',
  './to-do.js',
  './manifest.json',
  './images/to-do-list.png',
  './images/delete.png',
  './images/unchecked.png',
  './images/checked_2.png',
  './images/checked.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => caches.match('./to-do.html'))
  );
});
