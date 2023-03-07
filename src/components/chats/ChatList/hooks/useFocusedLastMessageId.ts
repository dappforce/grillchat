import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useEffect, useRef, useState } from 'react'

export default function useFocusedLastMessageId(postId: string) {
  const { getLastReadMessageId } = useLastReadMessageId(postId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())
  const shouldUpdateLastReadId = useRef(false)

  const { data: commentIds } = useCommentIdsByPostId(postId)
  const lastCommentId = commentIds?.[commentIds.length - 1]

  const hasSentMessage = isOptimisticId(lastCommentId ?? '')
  const hasReadAll = lastReadId === lastCommentId
  if (hasSentMessage || hasReadAll) shouldUpdateLastReadId.current = true

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== 'visible')
        shouldUpdateLastReadId.current = false
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!shouldUpdateLastReadId.current) return
    if (lastCommentId) setLastReadId(lastCommentId)
  }, [lastCommentId, shouldUpdateLastReadId])

  return shouldUpdateLastReadId.current ? lastCommentId : lastReadId
}
