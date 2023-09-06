import { getBlockedResourcesQuery } from '@/services/api/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

const cachedBlockedMap = new Map<readonly [any, any], Set<string>>()
function getBlockedSet(ids1: string[] | undefined, ids2: string[] | undefined) {
  const key = [ids1, ids2] as const
  if (cachedBlockedMap.has(key)) {
    return cachedBlockedMap.get(key)!
  }

  const set = new Set([...(ids1 ?? []), ...(ids2 ?? [])])
  cachedBlockedMap.set(key, set)

  return set
}

export default function useIsMessageBlocked(
  hubId: string,
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: hubModerationData } = getBlockedResourcesQuery.useQuery(
    { spaceId: hubId },
    {
      enabled: !!hubId,
    }
  )
  const { data: chatModerationData } = getBlockedResourcesQuery.useQuery(
    { postId: chatId },
    { enabled: !!chatId }
  )
  const blockedInHub = hubModerationData?.blockedResources
  const blockedInChat = chatModerationData?.blockedResources

  const blockedIdsSet = useMemo(() => {
    return getBlockedSet(blockedInHub?.postId, blockedInChat?.postId)
  }, [blockedInHub, blockedInChat])

  const blockedCidsSet = useMemo(() => {
    return getBlockedSet(blockedInHub?.cid, blockedInChat?.cid)
  }, [blockedInHub, blockedInChat])

  const blockedAddressesSet = useMemo(() => {
    return getBlockedSet(blockedInHub?.address, blockedInChat?.address)
  }, [blockedInHub, blockedInChat])

  return isMessageBlocked(message, {
    postIds: blockedIdsSet,
    contentIds: blockedCidsSet,
    addresses: blockedAddressesSet,
  })
}
