import { getBlockedMessageIdsInChatIdQuery } from '@/server/moderation/query'
import { filterBlockedMessageIds } from '@/utils/chat'
import { useMemo } from 'react'

export default function useFilterBlockedMessageIds(
  hubId: string,
  chatId: string,
  messageIds: string[]
) {
  const { data } = getBlockedMessageIdsInChatIdQuery.useQuery({
    hubId,
    chatId,
  })

  return useMemo(() => {
    return filterBlockedMessageIds(messageIds, data?.blockedMessageIds)
  }, [data?.blockedMessageIds, messageIds])
}
