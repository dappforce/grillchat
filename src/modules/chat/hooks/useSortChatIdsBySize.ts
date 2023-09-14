import { getCommentIdsByPostIdQuery } from '@/services/datahub/posts/query'
import { useMemo } from 'react'

export default function useSortChatIdsBySize(chatIds: string[]) {
  const messageIdsQueries = getCommentIdsByPostIdQuery.useQueries(chatIds)

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
