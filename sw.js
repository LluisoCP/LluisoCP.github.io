const currentCache    = 'CACHE_1'
const oldCaches       = []
const toCache         = [
  '/index.html',
  '/index.css'
]
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  )
})

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(currentCache).then(function(cache) {
      return cache.addAll(toCache)
    })
  )
})

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
    .then(cacheNames => Promise.all(cacheNames.filter(cacheName => oldCaches.includes(cacheName)).map(cacheName => caches.delete(cacheName))))
  )
})
