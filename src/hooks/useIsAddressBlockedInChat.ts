import { getPostQuery } from '@/services/api/query'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { useMemo } from 'react'

export default function useIsAddressBlockedInChat(
  address: string,
  chatId: string,
  currentHubId: string
) {
  const { data: chat } = getPostQuery.useQuery(chatId)
  const originalHubId = chat?.struct.spaceId
  const entityId = chat?.entityId

  const { data: originalHubModeration } = getBlockedResourcesQuery.useQuery({
    spaceId: originalHubId ?? '',
  })
  const { data: hubModeration } = getBlockedResourcesQuery.useQuery({
    spaceId: currentHubId ?? '',
  })
  const blockedInOriginalHub = originalHubModeration?.blockedResources.address
  const blockedInHub = hubModeration?.blockedResources.address

  const { data: chatModerationData } = getBlockedResourcesQuery.useQuery({
    postEntityId: entityId || '',
  })
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
