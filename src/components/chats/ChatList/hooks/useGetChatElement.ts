import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { PostData } from '@subsocial/api/types'
import { UseQueryResult } from '@tanstack/react-query'
import { getChatItemId } from '../helpers'

export default function useGetChatElement(
  postId: string,
  loadedComments: UseQueryResult<PostData | null, unknown>[],
  loadMore: () => void
) {
  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const getChatElement = async (commentId: string) => {
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    const elementId = getChatItemId(commentId)
    const element = document.getElementById(elementId)
    if (element) return element

    const isCommentIdIncluded = commentIds.includes(commentId)
    if (!isCommentIdIncluded) {
      loadMore()
    }
  }

  return getChatElement
}
