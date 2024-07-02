import { env } from '@/env.mjs'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { useMemo } from 'react'

export default function useIsAddressBlockedInChat(
  address: string,
  chatId: string
) {
  // const { data: chat } = getPostQuery.useQuery(chatId)
  // const originalHubId = chat?.struct.spaceId
  // const entityId = chat?.entityId

  // const { data: originalHubModeration } = getBlockedResourcesQuery.useQuery({
  //   spaceId: originalHubId ?? '',
  // })
  // const { data: hubModeration } = getBlockedResourcesQuery.useQuery({
  //   spaceId: currentHubId ?? '',
  // })
  const { data: chatModerationData, isLoading: loadingPostModeration } =
    getBlockedResourcesQuery.useQuery({
      postEntityId: chatId || '',
    })
  const { data: appModeration, isLoading: loadingAppModeration } =
    getBlockedResourcesQuery.useQuery({
      appId: env.NEXT_PUBLIC_APP_ID,
    })
  // const blockedAddressesInOriginalHub =
  //   originalHubModeration?.blockedResources.address
  // const blockedAddressesInHub = hubModeration?.blockedResources.address
  const blockedAddressesInChat = chatModerationData?.blockedResources.address
  const blockedAddressesInApp = appModeration?.blockedResources.address

  const blockedAddressesSet = useMemo(
    () =>
      new Set([
        // ...(blockedAddressesInOriginalHub ?? []),
        // ...(blockedAddressesInHub ?? []),
        ...(blockedAddressesInChat ?? []),
        ...(blockedAddressesInApp ?? []),
      ]),
    [
      // blockedAddressesInOriginalHub,
      // blockedAddressesInHub,
      blockedAddressesInChat,
      blockedAddressesInApp,
    ]
  )

  return {
    isBlocked: address && blockedAddressesSet.has(address),
    isLoading: loadingPostModeration || loadingAppModeration,
  }
}
