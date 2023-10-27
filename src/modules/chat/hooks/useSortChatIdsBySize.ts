import { useCommentIdsByPostIds } from '@/services/subsocial/commentIds'
import { useMemo } from 'react'

export default function useSortChatIdsBySize(chatIds: string[]) {
  const messageIdsQueries = useCommentIdsByPostIds(chatIds, {
    subscribe: true,
  })

  return useMemo(() => {
    const chatIdsContentLengths: { size: number; id: string }[] =
      messageIdsQueries.map((query, idx) => {
        return {
          id: chatIds[idx],
          size: query.data?.length ?? 0,
        }
      })

    chatIdsContentLengths.sort((a, b) => {
      const aSize = a.size
      const bSize = b.size
      return bSize - aSize
    })

    return chatIdsContentLengths.map(({ id }) => id)
  }, [messageIdsQueries, chatIds])
}
