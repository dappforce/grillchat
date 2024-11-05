import useLastReadTimeFromStorage from '@/components/chats/hooks/useLastReadMessageTimeFromStorage'
import { getPostQuery } from '@/services/api/query'
import { isClientGeneratedOptimisticId } from '@/services/subsocial/commentIds/optimistic'
import { useEffect, useRef, useState } from 'react'

export default function useLastFocusedMessageTime(
  chatId: string,
  lastMessageId: string
) {
  const { getLastReadTime } = useLastReadTimeFromStorage(chatId)
  const [lastFocusedTime, setLastFocusedTime] = useState(() =>
    getLastReadTime()
  )
  const shouldUpdateLastReadId = useRef(false)

  const { data: lastMessage } = getPostQuery.useQuery(lastMessageId)
  const lastMessageTime = lastMessage?.struct.createdAtTime

  // if the last message is client optimistic id, then it means the user just send a message, so it needs to remove any unreads
  const hasSentMessage = isClientGeneratedOptimisticId(lastMessageId)
  let hasReadAll = true
  if (lastMessageTime) {
    hasReadAll = lastFocusedTime >= lastMessageTime
  }

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
    if (lastMessageTime) setLastFocusedTime(lastMessageTime)
  }, [lastMessageTime, shouldUpdateLastReadId])

  return shouldUpdateLastReadId.current ? Date.now() : lastFocusedTime
}
