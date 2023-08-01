// Handling Notification Click event.
// Keep this method above the importScripts to avoid overriding.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  let urlToOpen = self.location.origin

  try {
    const notification = event.notification?.data

    if (notification) {
      const data = notification['FCM_MSG']['data']
      const { postId, rootPostId, spaceId } = data
      urlToOpen += `/${spaceId}/${rootPostId}/${postId}`
    }
  } catch (e) {
    console.log('Error in loading notification response:', e)
  } finally {
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

importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js')

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
})

const initMessaging = firebase.messaging()
