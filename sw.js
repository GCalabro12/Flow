const CACHE = 'flow-cache-v231';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('flow-cache-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('?')) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => {
    const copia = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request)));
});
