const CACHE_NAME = 'synthoma-v2'
const STATIC_CACHE = [
  '/assets/favicon.ico',
  '/assets/og-synthoma.png'
]

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
        .then((networkResponse) => {
          if (networkResponse.ok && networkResponse.status !== 206) {
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, networkResponse.clone()))
            )
          }
          return networkResponse
        })
        .catch(async () => (
          await caches.match(request)
          || await caches.match('/')
          || new Response('Offline', { status: 503 })
        ))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => (
      cachedResponse || fetch(request).then((networkResponse) => {
        if (networkResponse.ok && networkResponse.status !== 206) {
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
