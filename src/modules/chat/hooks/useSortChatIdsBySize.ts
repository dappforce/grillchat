import { useMessagesCounts } from '@/hooks/useMessagesCount'
import { useMemo } from 'react'

export default function useSortChatIdsBySize(chatIds: string[]) {
  const messagesCounts = useMessagesCounts(chatIds)

  return useMemo(() => {
    const chatIdsContentLengths: { size: number; id: string }[] =
      messagesCounts.map((count, idx) => {
        return {
          id: chatIds[idx],
          size: count,
        }
      })

    chatIdsContentLengths.sort((a, b) => {
      const aSize = a.size
      const bSize = b.size
      return bSize - aSize
    })

    return chatIdsContentLengths.map(({ id }) => id)
  }, [chatIds, messagesCounts])
}
