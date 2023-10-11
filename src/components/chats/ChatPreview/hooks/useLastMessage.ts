import { getPostQuery } from '@/services/api/query'
import { getCommentIdsByPostIdQuery } from '@/services/subsocial/commentIds'

export default function useLastMessage(chatId: string) {
  const { data: messageIds } = getCommentIdsByPostIdQuery.useQuery(chatId)
  const lastMessageId = messageIds?.[messageIds?.length - 1]
  return getPostQuery.useQuery(lastMessageId ?? '')
}
