import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'

export default function useLastMessage(chatId: string) {
  const { data: messageIds } = useCommentIdsByPostId(chatId, {
    subscribe: true,
  })
  const lastMessageId = messageIds?.[messageIds?.length - 1]
  return getPostQuery.useQuery(lastMessageId ?? '')
}
