// Handling Notification Click event.
// Keep this method above the importScripts to avoid overriding.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  let urlToOpen = self.location.origin
  let spaceId = ''

  try {
    const notification = event.notification?.data

    if (notification) {
      const data = notification['FCM_MSG']['data']
      const { postId, rootPostId } = data
      spaceId = data.spaceId
      urlToOpen += `/${spaceId}/${rootPostId}/${postId}`
    }
  } catch (e) {
    console.log('Error in loading notification response:', e)
  } finally {
    // Update / clear the value for App Badge on notification click.
    event.waitUntil(navigator.clearAppBadge())

    event.waitUntil(
      // Check if a client (window/tab) is already open and in focus.
      clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            // If the client with the specified URL is already open, focus it and navigate to the URL.
            if (
              client.url.includes(self.location.origin) &&
              client.url.includes(`/${spaceId}`) &&
              'focus' in client
            ) {
              return client.focus().then(() => client.navigate(urlToOpen))
            }
          }
          // If no client with the URL is open, open a new window/tab with the PWA and navigate to the URL.
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

self.addEventListener('push', (event) => {
  // Fetch the value for setting app badge from GraphQL.
  // And pass it like this: navigator.setAppBadge(value).
  event.waitUntil(navigator.setAppBadge())
})

importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})

const initMessaging = firebase.messaging()
