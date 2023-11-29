import { getPostQuery } from '@/services/api/query'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

const cachedBlockedMap = new Map<any, Map<any, Set<string>>>()
function getBlockedSet(ids1: string[] | undefined, ids2: string[] | undefined) {
  if (cachedBlockedMap.has(ids1)) {
    const cachedMap = cachedBlockedMap.get(ids1)!
    if (cachedMap.has(ids2)) {
      return cachedMap.get(ids2)!
    }
  }

  const set = new Set([...(ids1 ?? []), ...(ids2 ?? [])])
  if (!cachedBlockedMap.has(ids1)) {
    cachedBlockedMap.set(ids1, new Map())
  }
  cachedBlockedMap.get(ids1)!.set(ids2, set)

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
  const { data: chat } = getPostQuery.useQuery(chatId)
  const entityId = chat?.entityId ?? ''
  const { data: chatModerationData } = getBlockedResourcesQuery.useQuery(
    { postId: entityId },
    { enabled: !!entityId }
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
