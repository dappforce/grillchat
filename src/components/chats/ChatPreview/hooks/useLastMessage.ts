import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'

export default function useLastMessage(postId: string) {
  const { data: commentIds } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const lastCommentId = commentIds?.[commentIds?.length - 1]
  return getPostQuery.useQuery(lastCommentId ?? '')
}
