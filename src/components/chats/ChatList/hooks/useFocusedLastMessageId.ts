import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useEffect, useRef, useState } from 'react'

export default function useFocusedLastMessageId(chatId: string) {
  const { getLastReadMessageId } = useLastReadMessageId(chatId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())
  const shouldUpdateLastReadId = useRef(false)

  const { data: messageIds } = useCommentIdsByPostId(chatId)
  const lastMessageId = messageIds?.[messageIds.length - 1]

  const hasSentMessage = isOptimisticId(lastMessageId ?? '')
  const hasReadAll = lastReadId === lastMessageId
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
    if (lastMessageId) setLastReadId(lastMessageId)
  }, [lastMessageId, shouldUpdateLastReadId])

  return shouldUpdateLastReadId.current ? lastMessageId : lastReadId
}
