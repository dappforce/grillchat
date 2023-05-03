import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'

export default function useLastMessage(postId: string) {
  const { data: messageIds } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const lastMessageId = messageIds?.[messageIds?.length - 1]
  return getPostQuery.useQuery(lastMessageId ?? '')
}
