import {
  getBlockedInPostIdQuery,
  getBlockedInSpaceIdQuery,
} from '@/services/api/moderation/query'
import { filterBlockedMessageIds } from '@/utils/chat'
import { useMemo } from 'react'

export default function useFilterBlockedMessageIds(
  hubId: string,
  chatId: string,
  messageIds: string[]
) {
  const { data: blockedInHub } = getBlockedInSpaceIdQuery.useQuery(hubId)
  const { data: blockedInChat } = getBlockedInPostIdQuery.useQuery(chatId)

  return useMemo(() => {
    const blockedInChatMessageIds = blockedInChat?.blockedResources.postId ?? []
    const blockedInHubMessageIds = blockedInHub?.blockedResources.postId ?? []

    return filterBlockedMessageIds(messageIds, [
      ...blockedInChatMessageIds,
      ...blockedInHubMessageIds,
    ])
  }, [messageIds, blockedInChat, blockedInHub])
}
