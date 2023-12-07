import { getPostQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { identityModerationEncoder } from '@/services/datahub/identity/utils'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { getAppId } from '@/utils/env/client'
import { useMemo } from 'react'

export default function useIsAddressBlockedInChat(
  address: string,
  chatId: string,
  currentHubId: string
) {
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(address)

  const { data: chat } = getPostQuery.useQuery(chatId)
  const originalHubId = chat?.struct.spaceId
  const entityId = chat?.entityId

  const { data: originalHubModeration } = getBlockedResourcesQuery.useQuery({
    spaceId: originalHubId ?? '',
  })
  const { data: hubModeration } = getBlockedResourcesQuery.useQuery({
    spaceId: currentHubId ?? '',
  })
  const { data: chatModerationData } = getBlockedResourcesQuery.useQuery({
    postEntityId: entityId || '',
  })
  const { data: appModeration } = getBlockedResourcesQuery.useQuery({
    appId: getAppId(),
  })
  const blockedAddressesInOriginalHub =
    originalHubModeration?.blockedResources.address
  const blockedAddressesInHub = hubModeration?.blockedResources.address
  const blockedAddressesInChat = chatModerationData?.blockedResources.address
  const blockedAddressesInApp = appModeration?.blockedResources.address

  const blockedIdentitiesInOriginalHub =
    originalHubModeration?.blockedResources.identity
  const blockedIdentitiesInHub = hubModeration?.blockedResources.identity
  const blockedIdentitiesInChat = chatModerationData?.blockedResources.identity
  const blockedIdentitiesInApp = appModeration?.blockedResources.identity

  const blockedAddressesSet = useMemo(
    () =>
      new Set([
        ...(blockedAddressesInOriginalHub ?? []),
        ...(blockedAddressesInHub ?? []),
        ...(blockedAddressesInChat ?? []),
        ...(blockedAddressesInApp ?? []),
      ]),
    [
      blockedAddressesInOriginalHub,
      blockedAddressesInHub,
      blockedAddressesInChat,
      blockedAddressesInApp,
    ]
  )
  const blockedIdentitiesSet = useMemo(
    () =>
      new Set([
        ...(blockedIdentitiesInOriginalHub ?? []),
        ...(blockedIdentitiesInHub ?? []),
        ...(blockedIdentitiesInChat ?? []),
        ...(blockedIdentitiesInApp ?? []),
      ]),
    [
      blockedIdentitiesInOriginalHub,
      blockedIdentitiesInHub,
      blockedIdentitiesInChat,
      blockedIdentitiesInApp,
    ]
  )

  return (
    address &&
    (blockedAddressesSet.has(address) ||
      blockedIdentitiesSet.has(
        identityModerationEncoder.encode(linkedIdentity?.externalId) ?? ''
      ))
  )
}
