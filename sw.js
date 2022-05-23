const currentCache    = 'CACHE_1'
const oldCaches       = []
const toCache         = [
  '/index.html',
  '/index.css'
]
const swOptions = {includeUncontrolled: true, type:"window"}
const playRegexp = /(\d+)@(\w+)/
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

self.addEventListener("periodicsync", e => {
  const pbsMatches = e.tag.match(playRegexp)
  if (pbsMatches) {
    const pbsMatch = pbsMatches[0]
    if (~pbsMatch.indexOf("first")) {
      self.registration.showNotification("First", {
        body: pbsMatches[0],
        icon: 'https://lluisocp.github.io/s/senzu_logo_medium.png',
        image: 'https://lluisocp.github.io/img/logo_180.png',
        vibrate: [300, 100, 300],
        tag: "test_notif",
        badge: 'https://lluisocp.github.io/s/second/senzu_black_logo_small.png'
      })
    } else if (~pbsMatch.indexOf("second")) {
      self.registration.showNotification("Second", {
        body: pbsMatches[0],
        icon: 'https://lluisocp.github.io/s/senzu_logo_medium.png',
        image: 'https://lluisocp.github.io/img/logo_180.png',
        vibrate: [300, 100, 300],
        tag: "test_notif",
        badge: 'https://lluisocp.github.io/s/second/senzu_black_logo_small.png'
      })
    }
  }
})
self.addEventListener("notificationclick", event => {
  if (event.notification.tag === "test_notif") {
    event.notification.close()
    event.waitUntil(
      clients.matchAll(swOptions)
      .then(allClients => {
        let currentClient;
        for (let client of allClients) {
          if(~client['url'].indexOf("lluisocp.github.io/s/second")) {
            client.focus()
            currentClient = client
            break
          }
        }
        if (!currentClient) {
          return clients.openWindow("https://lluisocp.github.io/s/second/index.html")
        }
      })
      .catch(e => console.log(e.name, e.message, e.lineNumber))
    )
  }
})
