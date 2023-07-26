import {
  getBlockedInPostIdQuery,
  getBlockedInSpaceIdQuery,
} from '@/services/api/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { useMemo } from 'react'

export default function useIsAddressBlockedInChat(
  address: string,
  chatId: string,
  currentHubId: string
) {
  const { data: chat } = getPostQuery.useQuery(chatId)
  const originalHubId = chat?.struct.spaceId

  const { data: originalHubModeration } = getBlockedInSpaceIdQuery.useQuery(
    originalHubId ?? '',
    { enabled: !!originalHubId }
  )
  const { data: hubModeration } = getBlockedInSpaceIdQuery.useQuery(
    currentHubId ?? '',
    { enabled: !!currentHubId }
  )
  const blockedInOriginalHub = originalHubModeration?.blockedResources.address
  const blockedInHub = hubModeration?.blockedResources.address

  const { data: chatModerationData } = getBlockedInPostIdQuery.useQuery(chatId)
  const blockedInChat = chatModerationData?.blockedResources.address

  const blockedAddressesSet = useMemo(
    () =>
      new Set([
        ...(blockedInOriginalHub ?? []),
        ...(blockedInHub ?? []),
        ...(blockedInChat ?? []),
      ]),
    [blockedInOriginalHub, blockedInHub, blockedInChat]
  )

  return address && blockedAddressesSet.has(address)
}
