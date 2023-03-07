import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useEffect, useState } from 'react'

export default function useFocusedLastMessageId(postId: string) {
  const { getLastReadMessageId } = useLastReadMessageId(postId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())

  const { data: commentIds } = useCommentIdsByPostId(postId)

  useEffect(() => {
    if (document.visibilityState === 'visible') {
      const lastCommentId = commentIds?.[commentIds.length - 1]
      if (lastCommentId) setLastReadId(lastCommentId)
    }
  }, [getLastReadMessageId, commentIds])

  return lastReadId
}
