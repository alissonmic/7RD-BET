const CACHE_NAME = '7rdbet-v2';
const ASSETS = [
  './', './index.html', './bet.html', './styles.css',
  './data.js', './horarios.js', './storage.js', './seed.js', 
  './bet.js', './betpage.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
