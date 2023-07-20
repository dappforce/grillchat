import {
  getBlockedInPostIdQuery,
  getBlockedInSpaceIdQuery,
} from '@/services/api/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useIsMessageBlocked(
  hubId: string,
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: hubModerationData } = getBlockedInSpaceIdQuery.useQuery(hubId)
  const { data: chatModerationData } = getBlockedInPostIdQuery.useQuery(chatId)
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
