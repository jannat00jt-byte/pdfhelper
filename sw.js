const CACHE = 'pdf-tools-v2';
const STATIC = [
  '/',
  '/css/style.css',
  '/js/converter.js',
  '/js/app.js',
  '/manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/blog/') && e.request.method === 'GET') {
    e.respondWith(caches.open(CACHE + '-blog').then(cache =>
      fetch(e.request).then(res => { cache.put(e.request, res.clone()); return res; }).catch(() => caches.match(e.request))
    ));
    return;
  }
  if (url.hostname.includes('unpkg.com')) {
    e.respondWith(caches.open(CACHE).then(cache =>
      fetch(e.request).then(res => { cache.put(e.request, res.clone()); return res; }).catch(() => caches.match(e.request))
    ));
    return;
  }
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
