import { getPostQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { getAppId } from '@/utils/env/client'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

const cachedBlockedMap = new Map<any, Map<any, Map<any, Set<string>>>>()
function getBlockedSet(
  ids1: string[] | undefined,
  ids2: string[] | undefined,
  ids3: string[] | undefined
) {
  const cachedData = cachedBlockedMap.get(ids1)?.get(ids2)?.get(ids3)
  if (cachedData) {
    return cachedData
  }

  const set = new Set([...(ids1 ?? []), ...(ids2 ?? []), ...(ids3 ?? [])])
  if (!cachedBlockedMap.has(ids1)) {
    cachedBlockedMap.set(ids1, new Map())
  }
  if (!cachedBlockedMap.get(ids1)!.has(ids2)) {
    cachedBlockedMap.get(ids1)!.set(ids2, new Map())
  }
  cachedBlockedMap.get(ids1)!.get(ids2)!.set(ids3, set)

  return set
}

export default function useIsMessageBlocked(
  hubId: string,
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: appModerationData } = getBlockedResourcesQuery.useQuery({
    appId: getAppId(),
  })
  const { data: hubModerationData } = getBlockedResourcesQuery.useQuery({
    spaceId: hubId,
  })
  const { data: chat } = getPostQuery.useQuery(chatId)
  const ownerId = chat?.struct.ownerId
  const { data: identity } = getLinkedIdentityQuery.useQuery(ownerId ?? '')

  const entityId = chat?.entityId ?? ''
  const { data: chatModerationData } = getBlockedResourcesQuery.useQuery({
    postEntityId: entityId,
  })
  const blockedInApp = appModerationData?.blockedResources
  const blockedInHub = hubModerationData?.blockedResources
  const blockedInChat = chatModerationData?.blockedResources

  const blockedIdsSet = useMemo(() => {
    return getBlockedSet(
      blockedInHub?.postId,
      blockedInChat?.postId,
      blockedInApp?.postId
    )
  }, [blockedInHub, blockedInChat, blockedInApp])

  const blockedCidsSet = useMemo(() => {
    return getBlockedSet(
      blockedInHub?.cid,
      blockedInChat?.cid,
      blockedInApp?.cid
    )
  }, [blockedInHub, blockedInChat, blockedInApp])

  const blockedAddressesSet = useMemo(() => {
    return getBlockedSet(
      blockedInHub?.address,
      blockedInChat?.address,
      blockedInApp?.address
    )
  }, [blockedInHub, blockedInChat, blockedInApp])

  const blockedIdentitiesSet = useMemo(() => {
    return getBlockedSet(
      blockedInHub?.identity,
      blockedInChat?.identity,
      blockedInApp?.identity
    )
  }, [blockedInHub, blockedInChat, blockedInApp])

  return isMessageBlocked(message, identity, {
    postIds: blockedIdsSet,
    contentIds: blockedCidsSet,
    addresses: blockedAddressesSet,
    identities: blockedIdentitiesSet,
  })
}
