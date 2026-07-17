const CACHE_NAME = 'synthoma-v3'
const OFFLINE_URL = '/offline.html'
const STATIC_CACHE = [
  OFFLINE_URL,
  '/assets/favicon.ico',
  '/assets/og-synthoma.png'
]
const CACHEABLE_DESTINATIONS = new Set(['audio', 'font', 'image', 'script', 'style', 'video'])

function isSensitiveRequest(request) {
  const { pathname } = new URL(request.url)
  return pathname.startsWith('/api/')
    || pathname === '/profile'
    || pathname.startsWith('/admin')
    || pathname.startsWith('/login')
    || pathname.startsWith('/register')
    || pathname.startsWith('/purchase')
}

function isCacheableAsset(request, response) {
  const cacheControl = response.headers.get('cache-control') || ''
  return CACHEABLE_DESTINATIONS.has(request.destination)
    && response.ok
    && response.status !== 206
    && !cacheControl.includes('private')
    && !cacheControl.includes('no-store')
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Navigations are network-first so a deployment cannot revive an old HTML shell.
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return

  const isNavigation = request.mode === 'navigate'
    || request.headers.get('accept')?.includes('text/html')

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .catch(async () => await caches.match(OFFLINE_URL)
          || new Response('Offline', { status: 503 }))
    )
    return
  }

  // Account, API and purchase traffic always bypasses Cache Storage.
  if (isSensitiveRequest(request) || !CACHEABLE_DESTINATIONS.has(request.destination)) return

  event.respondWith(
    caches.match(request).then((cachedResponse) => (
      cachedResponse || fetch(request).then((networkResponse) => {
        if (isCacheableAsset(request, networkResponse)) {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, networkResponse.clone()))
          )
        }
        return networkResponse
      })
    ))
  )
})
