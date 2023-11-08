import usePrevious from '@/hooks/usePrevious'
import { useMessageData } from '@/stores/message'
import { useCallback, useEffect } from 'react'

export default function useAnyNewData(renderedMessageIds: string[]) {
  const unreadMessage = useMessageData((state) => state.unreadMessage)
  const setUnreadMessage = useMessageData((state) => state.setUnreadMessage)
  const previousData = usePrevious(renderedMessageIds)

  useEffect(() => {
    const previous = previousData ?? renderedMessageIds
    const prevLastId = previous[0]

    const newDataLength = renderedMessageIds.findIndex(
      (id) => id === prevLastId
    )

    if (newDataLength > 0)
      setUnreadMessage((prev) => {
        return {
          count: prev.count + newDataLength,
          lastMessageTime: prev.lastMessageTime,
        }
      })
  }, [previousData, renderedMessageIds, setUnreadMessage])

  const clearAnyNewData = useCallback(
    () => setUnreadMessage({ count: 0, lastMessageTime: Date.now() }),
    [setUnreadMessage]
  )

  return {
    anyNewData: unreadMessage.count,
    clearAnyNewData,
  }
}
