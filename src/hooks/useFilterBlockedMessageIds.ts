import { env } from '@/env.mjs'
import { getPostQuery } from '@/services/api/query'
import { getBlockedResourcesQuery } from '@/services/datahub/moderation/query'
import { filterBlockedMessageIds } from '@/utils/chat'
import { useMemo } from 'react'

export default function useFilterBlockedMessageIds(
  hubId: string,
  chatId: string,
  messageIds: string[]
) {
  const { data: blockedInHub } = getBlockedResourcesQuery.useQuery({
    spaceId: hubId,
  })
  const { data: chat } = getPostQuery.useQuery(chatId)
  const { data: blockedInChat } = getBlockedResourcesQuery.useQuery({
    postEntityId: chat?.entityId ?? '',
  })
  const appId = env.NEXT_PUBLIC_APP_ID
  const { data: blockedInApp } = getBlockedResourcesQuery.useQuery({ appId })

  return useMemo(() => {
    const blockedInChatMessageIds = blockedInChat?.blockedResources.postId ?? []
    const blockedInHubMessageIds = blockedInHub?.blockedResources.postId ?? []
    const blockedInAppMessageIds = blockedInApp?.blockedResources.postId ?? []

    return filterBlockedMessageIds(messageIds, [
      ...blockedInChatMessageIds,
      ...blockedInHubMessageIds,
      ...blockedInAppMessageIds,
    ])
  }, [messageIds, blockedInChat, blockedInHub, blockedInApp])
}
