import { lastReadTimeLocalForage } from '@/components/chats/hooks/useLastReadMessageTimeFromStorage'
import { env } from '@/env.mjs'
import useWrapInRef from '@/hooks/useWrapInRef'
import { followedIdsStorage, useMyMainAddress } from '@/stores/my-account'
import { GraphQLClient, gql } from 'graphql-request'
import { useEffect } from 'react'

export default function BadgeManager() {
  const myAddress = useMyMainAddress()
  const myAddressRef = useWrapInRef(myAddress)

  useEffect(() => {
    function listener() {
      if (document.visibilityState === 'hidden') syncBadge(myAddressRef.current)
      else clearBadge()
    }
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [myAddressRef])

  return null
}

async function syncBadge(address: string | null) {
  const unreadCount = await getUnreadCount(address)
  if (!unreadCount) {
    await clearBadge()
  } else {
    await setBadge(unreadCount)
  }
}

async function getUnreadCount(address: string | null) {
  const squidUrl = env.NEXT_PUBLIC_SQUID_URL
  if (!squidUrl) return 0

  let chatIdsToFetch = ['754', '7465']
  if (address) {
    try {
      const followedIds = JSON.parse(followedIdsStorage.get(address) ?? '[]')
      if (followedIds && Array.isArray(followedIds)) {
        chatIdsToFetch.push(...(followedIds as string[]).slice(0, 10))
        chatIdsToFetch = Array.from(new Set(chatIdsToFetch))
      }
    } catch {}
  }

  const queries: { query: string; chatId: string }[] = []
  const promises = chatIdsToFetch.map(async (chatId) => {
    const lastReadTime = await lastReadTimeLocalForage.get(chatId)
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
    const data: any = await client.request(gql`
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
    console.warn('Error fetching unreads in badge manager', e)
    return undefined
  }
}

async function clearBadge() {
  if (
    'clearAppBadge' in navigator &&
    typeof navigator.clearAppBadge === 'function'
  ) {
    try {
      await navigator.clearAppBadge()
    } catch (error) {
      console.error('Failed to clear app badge:', error)
    }
  }
}

async function setBadge(count: number) {
  if (
    'setAppBadge' in navigator &&
    typeof navigator.setAppBadge === 'function'
  ) {
    try {
      await navigator.setAppBadge(count)
    } catch (error) {
      console.error('Failed to set app badge:', error)
    }
  }
}
