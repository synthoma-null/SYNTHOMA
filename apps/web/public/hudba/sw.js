/* Separate from the main SYNTHOMA worker and its cache cleanup prefix. */
const CACHE = 'music-pwa-v1';
const PAGE = '/hudba/index.html';
const SHELL = [PAGE, '/hudba.css?v=5', '/hudba/pwa.js', '/hudba/manifest.webmanifest',
  '/hudba/icon-192.png', '/hudba/icon-512.png', '/hudba/apple-touch-icon.png',
  '/assets/hudba-background.webp', '/assets/icon_512.png',
  '/fonts/astronboy/astronbw.ttf', '/fonts/euro/eurof35.ttf', '/fonts/VT323-Regular.ttf'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    // Catalog is optional: installation still works during an API outage.
    try {
      const response = await fetch('/api/hudba', {cache: 'no-store'});
      if (response.ok) await cache.put('/api/hudba', response);
    } catch { /* It can be cached on the first successful visit. */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('music-pwa-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(request, {signal: controller.signal});
    if (!response.ok) throw new Error('Unavailable');
    try { await cache.put(key, response.clone()); } catch { /* Playback must not depend on free cache space. */ }
    return response;
  } catch {
    return await cache.match(key) || new Response('Připojte se k internetu a zkuste to znovu.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  } finally { clearTimeout(timer); }
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never cache partial audio responses or intercept the main website's routes.
  if (/\.mp3$/i.test(url.pathname) || event.request.headers.has('range')) return;
  if (url.pathname === '/api/hudba') {
    event.respondWith(networkFirst(event.request, '/api/hudba'));
  } else if (event.request.mode === 'navigate' && url.pathname === PAGE) {
    event.respondWith(networkFirst(event.request, PAGE));
  } else if (SHELL.includes(url.pathname + url.search)) {
    event.respondWith(networkFirst(event.request, url.pathname + url.search));
  }
});
