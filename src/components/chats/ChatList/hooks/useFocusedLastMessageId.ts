import useLastReadMessageIdFromStorage from '@/components/chats/hooks/useLastReadMessageId'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useEffect, useRef, useState } from 'react'
import usePaginatedMessageIds from '../../hooks/usePaginatedMessageIds'

export default function useFocusedLastMessageId(chatId: string) {
  const { getLastReadMessageId } = useLastReadMessageIdFromStorage(chatId)
  const [lastReadId, setLastReadId] = useState(() => getLastReadMessageId())
  const shouldUpdateLastReadId = useRef(false)

  // need last message only
  const { currentPageMessageIds } = usePaginatedMessageIds({
    chatId,
    hubId: '',
  })
  const lastMessageId =
    currentPageMessageIds?.[currentPageMessageIds?.length - 1]

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
