import { gql, GraphQLClient } from 'graphql-request'
import { appStorage } from '../src/constants/localforage'

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

const getStorageKey = (chatId) => `last-read-${chatId}`
const getAddressStorageKey = () => 'accountPublicKey'
const getFollowedIdsStorageKey = (address) => `followedPostIds:${address}`
async function getUnreadCount(squidUrl) {
  const address = await appStorage.getItem(getAddressStorageKey())
  let chatIdsToFetch = ['754', '7465']
  if (address) {
    try {
      const followedIds = JSON.parse(
        (await appStorage.getItem(getFollowedIdsStorageKey(address))) ?? ''
      )
      if (followedIds) {
        chatIdsToFetch.push(...followedIds.slice(0, 5))
        chatIdsToFetch = Array.from(new Set(chatIdsToFetch))
      }
    } catch {}
  }

  const queries = []
  const promises = chatIdsToFetch.map(async (chatId) => {
    const lastReadTime = await appStorage.getItem(getStorageKey(chatId))
    if (!lastReadTime) return
    queries.push({
      query: `
        chat${chatId}: postsConnection (where: { createdAtTime_gt: "${lastReadTime}", rootPost: { id_eq: "${chatId}" } }, orderBy: id_ASC) {
          totalCount
        }
      `,
      chatId,
    })
  })
  await Promise.all(promises)

  if (queries.length === 0) {
    return undefined
  }

  try {
    const client = new GraphQLClient(squidUrl, { fetch: fetch })
    const data = await client.request(gql`
      query {
        ${queries.map(({ query }) => query).join('\n')}
      }
    `)
    let totalUnread = 0
    queries.forEach(({ chatId }) => {
      totalUnread += data[`chat${chatId}`].totalCount
    })

    return totalUnread
  } catch (e) {
    console.log('Error fetching unreads in service worker', e)
    return undefined
  }
}

async function setBadge(count) {
  if ('setAppBadge' in navigator) {
    try {
      await navigator.setAppBadge(count)
    } catch (error) {
      console.error('Failed to set app badge:', error)
    }
  }
}
self.addEventListener('push', async (event) => {
  const squidUrl = process.env.NEXT_PUBLIC_SQUID_URL
  const promises = []
  if (!squidUrl) {
    promises.push(setBadge(50))
  } else {
    promises.push(getUnreadCount(squidUrl).then((value) => setBadge(value)))
  }
  event.waitUntil(Promise.all(promises))
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
