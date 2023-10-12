import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { useMemo } from 'react'

export default function useSortChatIdsBySize(chatIds: string[]) {
  const postMetadataQueries = getPostMetadataQuery.useQueries(chatIds)

  return useMemo(() => {
    const chatIdsContentLengths: { size: number; id: string }[] =
      postMetadataQueries.map((query, idx) => {
        return {
          id: chatIds[idx],
          size: query.data?.totalCommentsCount ?? 0,
        }
      })

    chatIdsContentLengths.sort((a, b) => {
      const aSize = a.size
      const bSize = b.size
      return bSize - aSize
    })

    return chatIdsContentLengths.map(({ id }) => id)
  }, [chatIds, postMetadataQueries])
}
