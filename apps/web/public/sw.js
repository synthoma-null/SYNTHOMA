const CACHE_NAME = 'synthoma-v1'
const STATIC_CACHE = [
  '/',
  '/books',
  '/reader',
  '/autor',
  '/archive',
  '/landing-intro',
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

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Serve from cache if available
        if (response) {
          // For HTML files, try network first (stale-while-revalidate)
          if (request.headers.get('accept')?.includes('text/html')) {
            fetch(request).then((networkResponse) => {
              if (networkResponse.ok && networkResponse.status !== 206) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, networkResponse.clone())
                })
              }
            }).catch(() => {
              // Network failed, serve cached version
            })
          }
          return response
        }
        
        // For HTML files, always try network first
        if (request.headers.get('accept')?.includes('text/html')) {
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok && networkResponse.status !== 206) {
              // Cache successful responses
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return networkResponse
          }).catch(() => {
            // Network failed, return offline page
            return caches.match('/') || new Response('Offline', { status: 503 })
          })
        }
        
        // For other assets, cache first, then network
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok && networkResponse.status !== 206) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return networkResponse
        })
      })
  )
})
