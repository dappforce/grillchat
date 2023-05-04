import { getBlockedMessageIdsInChatIdQuery } from '@/services/moderation/query'
import { filterBlockedMessageIds } from '@/utils/chat'
import { useMemo } from 'react'

export default function useFilterBlockedMessageIds(
  chatId: string,
  messageIds: string[]
) {
  const { data: blockedIds } =
    getBlockedMessageIdsInChatIdQuery.useQuery(chatId)

  return useMemo(() => {
    return filterBlockedMessageIds(messageIds, blockedIds)
  }, [blockedIds, messageIds])
}
