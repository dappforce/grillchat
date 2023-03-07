import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useEffect, useState } from 'react'

export default function useFocusedLastMessageId(postId: string) {
  const { getLastReadMessageId } = useLastReadMessageId(postId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())
  const [shouldUpdateLastReadId, setShouldUpdateLastReadId] = useState(false)

  const { data: commentIds } = useCommentIdsByPostId(postId)
  const lastCommentId = commentIds?.[commentIds.length - 1]

  useEffect(() => {
    const hasSentMessage = isOptimisticId(lastCommentId ?? '')
    setShouldUpdateLastReadId(hasSentMessage)
  }, [lastCommentId])

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState !== 'visible')
        setShouldUpdateLastReadId(false)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!shouldUpdateLastReadId) return
    if (lastCommentId) setLastReadId(lastCommentId)
  }, [lastCommentId, shouldUpdateLastReadId])

  return lastReadId
}
