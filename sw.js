/* Gym Tracker – service worker (praca offline). Zmień VERSION przy każdej aktualizacji aplikacji. */
const VERSION = 'gt-v1.0.0';
const CORE = `${VERSION}-core`;
const FONTS = 'gt-fonts';
const PRECACHE = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png',
  './icons/favicon.svg', './icons/favicon-32.png', './icons/logo.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('gt-') && k !== CORE && k !== FONTS).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Czcionki Google: zapisz przy pierwszym połączeniu, potem działają offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const hit = await cache.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response('', { status: 504 });
    })());
    return;
  }

  if (url.origin !== location.origin) return;

  // Nawigacja: sieć z krótkim limitem, w razie braku – wersja z pamięci.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CORE);
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3500);
        const r = await fetch(req, { signal: ctrl.signal, cache: 'no-cache' });
        clearTimeout(t);
        if (r.ok) cache.put('./index.html', r.clone());
        return r;
      } catch (_) {
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Reszta plików własnych: cache first, z odświeżeniem w tle.
  e.respondWith((async () => {
    const cache = await caches.open(CORE);
    const hit = await cache.match(req);
    const net = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
