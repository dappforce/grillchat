import { getBlockedResourcesQuery } from '@/services/api/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

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

  const blockedIdsSet = useMemo(
    () =>
      new Set([
        ...(blockedInHub?.postId ?? []),
        ...(blockedInChat?.postId ?? []),
      ]),
    [blockedInHub, blockedInChat]
  )
  const blockedCidsSet = useMemo(
    () =>
      new Set([...(blockedInHub?.cid ?? []), ...(blockedInChat?.cid ?? [])]),
    [blockedInHub, blockedInChat]
  )
  const blockedAddressesSet = useMemo(
    () =>
      new Set([
        ...(blockedInHub?.address ?? []),
        ...(blockedInChat?.address ?? []),
      ]),
    [blockedInHub, blockedInChat]
  )

  return isMessageBlocked(message, {
    postIds: blockedIdsSet,
    contentIds: blockedCidsSet,
    addresses: blockedAddressesSet,
  })
}
