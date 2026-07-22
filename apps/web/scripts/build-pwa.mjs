import { generateSW } from 'workbox-build';
import fs from 'node:fs/promises';

const PWA_VERSION = '1.0.0-pwa.2';
const buildId = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local')
  .replace(/[^a-z0-9.-]/gi, '-')
  .slice(0, 16)
  .toLowerCase();
const suffix = `${PWA_VERSION}-${buildId}`.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
const isSensitive = ({ url }) => url.origin === self.location.origin && (
  url.pathname.startsWith('/api/')
  || url.pathname === '/profile'
  || url.pathname.startsWith('/admin')
  || url.pathname.startsWith('/login')
  || url.pathname.startsWith('/register')
  || url.pathname.startsWith('/purchase')
);
const isNextStream = ({ request, url }) => url.origin === self.location.origin && (
  url.searchParams.has('_rsc')
  || request.headers.has('RSC')
  || request.headers.has('Next-Router-Prefetch')
  || request.headers.has('Next-Router-State-Tree')
);
const safeCachePlugin = {
  cacheWillUpdate: async ({ response }) => {
    const contentType = response.headers.get('content-type') || '';
    if (response.bodyUsed || contentType.includes('text/x-component')) return null;
    return response.status === 0 || response.status === 200 ? response : null;
  },
};

const { count, size, warnings } = await generateSW({
  cacheId: `synthoma-shell-${suffix}`,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  swDest: 'public/sw.js',
  globDirectory: '.next/static',
  globPatterns: ['css/*.css'],
  modifyURLPrefix: { '': '/_next/static/' },
  additionalManifestEntries: [
    { url: '/offline', revision: suffix },
    { url: '/icons/pwa-192x192.png', revision: suffix },
    { url: '/icons/pwa-512x512.png', revision: suffix },
    { url: '/icons/pwa-maskable-192x192.png', revision: suffix },
    { url: '/icons/pwa-maskable-512x512.png', revision: suffix },
    { url: '/icons/apple-touch-icon-180x180.png', revision: suffix },
    { url: '/fonts/VT323-Regular.ttf', revision: suffix },
    { url: '/fonts/Handjet.ttf', revision: suffix },
    { url: '/fonts/astronboy/astronbw.ttf', revision: suffix },
  ],
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
  inlineWorkboxRuntime: true,
  mode: 'production',
  sourcemap: false,
  navigationPreload: true,
  runtimeCaching: [
    { urlPattern: isNextStream, handler: 'NetworkOnly', method: 'GET' },
    { urlPattern: isSensitive, handler: 'NetworkOnly', method: 'GET' },
    {
      urlPattern: ({ request, url }) => request.destination === 'style' && url.pathname.startsWith('/_next/static/css/'),
      handler: 'CacheFirst',
      options: { cacheName: `synthoma-reader-${suffix}`, expiration: { maxEntries: 40, maxAgeSeconds: 30 * 24 * 60 * 60 }, plugins: [safeCachePlugin] },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/_next/static/'),
      handler: 'CacheFirst',
      options: { cacheName: `synthoma-static-${suffix}`, expiration: { maxEntries: 180, maxAgeSeconds: 365 * 24 * 60 * 60 }, plugins: [safeCachePlugin] },
    },
    {
      urlPattern: ({ request, url }) => request.destination === 'font' && url.origin === self.location.origin,
      handler: 'CacheFirst',
      options: { cacheName: `synthoma-fonts-${suffix}`, expiration: { maxEntries: 32, maxAgeSeconds: 365 * 24 * 60 * 60 }, plugins: [safeCachePlugin] },
    },
    {
      urlPattern: ({ request, url }) => request.destination === 'image' && url.origin === self.location.origin,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: `synthoma-images-${suffix}`, expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }, plugins: [safeCachePlugin] },
    },
    {
      urlPattern: ({ request, url }) => request.mode === 'navigate' && (url.pathname.startsWith('/chapter/') || url.pathname === '/reader'),
      handler: 'NetworkFirst',
      options: { cacheName: `synthoma-reader-${suffix}`, networkTimeoutSeconds: 3, expiration: { maxEntries: 36, maxAgeSeconds: 30 * 24 * 60 * 60 }, plugins: [safeCachePlugin], precacheFallback: { fallbackURL: '/offline' } },
    },
    {
      urlPattern: ({ request, url }) => request.mode === 'navigate' && url.origin === self.location.origin,
      handler: 'NetworkFirst',
      options: { cacheName: `synthoma-pages-${suffix}`, networkTimeoutSeconds: 3, expiration: { maxEntries: 48, maxAgeSeconds: 7 * 24 * 60 * 60 }, plugins: [safeCachePlugin], precacheFallback: { fallbackURL: '/offline' } },
    },
  ],
});

const worker = await fs.readFile('public/sw.js', 'utf8');
const recoveryBootstrap = `/* SYNTHOMA PWA ${PWA_VERSION} // BUILD ${buildId} */
self.__SYNTHOMA_PWA_BUILD__=${JSON.stringify(suffix)};
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const names=await caches.keys();const removed=await Promise.all(names.filter(name=>name.startsWith("synthoma-")&&!name.includes(self.__SYNTHOMA_PWA_BUILD__)).map(name=>caches.delete(name)));await self.clients.claim();const clients=await self.clients.matchAll({type:"window",includeUncontrolled:true});for(const client of clients)client.postMessage({type:"PWA_UPDATED",build:self.__SYNTHOMA_PWA_BUILD__,removedCaches:removed.filter(Boolean).length})})().catch(error=>console.warn("[PWA_RECOVERY_FAILED]",error)))});
`;
await fs.writeFile('public/sw.js', recoveryBootstrap + worker);

for (const warning of warnings) console.warn(warning);
console.log(`PWA service worker generated: ${count} precache entries, ${size} bytes.`);
