import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'

export default function useLastMessage(postId: string) {
  const { data: commentIds } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const lastCommentId = commentIds?.[commentIds?.length - 1]
  return getPostQuery.useQuery(lastCommentId ?? '')
}
