import { getBlockedResourcesQuery } from '@/services/subsocial/datahub/moderation/query'
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
  const { data: blockedInChat } = getBlockedResourcesQuery.useQuery({
    postId: chatId,
  })

  return useMemo(() => {
    const blockedInChatMessageIds = blockedInChat?.blockedResources.postId ?? []
    const blockedInHubMessageIds = blockedInHub?.blockedResources.postId ?? []

    return filterBlockedMessageIds(messageIds, [
      ...blockedInChatMessageIds,
      ...blockedInHubMessageIds,
    ])
  }, [messageIds, blockedInChat, blockedInHub])
}
