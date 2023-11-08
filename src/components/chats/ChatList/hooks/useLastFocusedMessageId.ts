import useLastReadMessageIdFromStorage from '@/components/chats/hooks/useLastReadMessageId'
import { isClientGeneratedOptimisticId } from '@/services/subsocial/commentIds/optimistic'
import { useEffect, useRef, useState } from 'react'

export default function useLastFocusedMessageId(
  chatId: string,
  lastMessageId: string
) {
  const { getLastReadMessageId } = useLastReadMessageIdFromStorage(chatId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())
  const shouldUpdateLastReadId = useRef(false)

  // if the last message is client optimistic id, then it means the user just send a message, so it needs to remove any unreads
  const hasSentMessage = isClientGeneratedOptimisticId(lastMessageId)
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
