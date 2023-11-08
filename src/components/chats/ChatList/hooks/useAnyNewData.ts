import usePrevious from '@/hooks/usePrevious'
import { useMessageData } from '@/stores/message'
import { useCallback, useEffect } from 'react'

export default function useAnyNewData(currentPageMessageIds: string[]) {
  const unreadMessage = useMessageData((state) => state.unreadMessage)
  const setUnreadMessage = useMessageData((state) => state.setUnreadMessage)
  const previousData = usePrevious(currentPageMessageIds)

  useEffect(() => {
    const previous = previousData ?? currentPageMessageIds
    const prevLastId = previous[0]

    const newDataLength = currentPageMessageIds.findIndex(
      (id) => id === prevLastId
    )

    if (newDataLength > 0)
      setUnreadMessage((prev) => {
        return {
          count: prev.count + newDataLength,
          lastId: prevLastId,
        }
      })
  }, [previousData, currentPageMessageIds, setUnreadMessage])

  const clearAnyNewData = useCallback(
    () => setUnreadMessage({ count: 0, lastId: '' }),
    [setUnreadMessage]
  )

  return {
    anyNewData: unreadMessage.count,
    clearAnyNewData,
  }
}
