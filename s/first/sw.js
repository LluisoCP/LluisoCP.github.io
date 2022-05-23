const swOptions = {includeUncontrolled: true, type:"window"}

self.addEventListener('install', function(e) {
  console.log('Install')
})

self.addEventListener('activate', function(event) {
  console.log('Activate')
})
console.log(self.registration.scope)
self.addEventListener("periodicsync", e => {
  if (e.tag === "pbs_first") {
    self.registration.showNotification("Notif", {
      body: "Test notification!",
      icon: 'https://lluisocp.github.io/s/senzu_logo_medium.png',
      // image: response.image ? response.image + '?size=75x75' : toCache[1],
      image: 'https://lluisocp.github.io/img/logo_180.png',
      vibrate: [300, 100, 300],
      tag: "test_notif",
      // badge: '/public/static/dist/img/senzu_black_logo.svg'
      badge: 'https://lluisocp.github.io/s/first/senzu_black_logo_small.png'
    })
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
          if(~client['url'].indexOf("lluisocp.github.io/s/first")) {
            client.focus()
            currentClient = client
            break
          }
        }
        if (!currentClient) {
          return clients.openWindow("index.html")
        }
      })
      .catch(e => console.log(e.name, e.message, e.lineNumber))
    )
  }
})
