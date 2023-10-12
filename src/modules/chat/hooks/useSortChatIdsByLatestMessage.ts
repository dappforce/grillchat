import { getPostQuery } from '@/services/api/query'
import { getPostMetadataQuery } from '@/services/subsocial/datahub/posts/query'
import { CommentData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useSortChatIdsByLatestMessage(chatIds: string[] = []) {
  const latestMessageIdsQueries = getPostMetadataQuery.useQueries(chatIds)
  const latestMessageIds = useMemo(() => {
    return latestMessageIdsQueries
      ?.map((query) => {
        return query.data?.lastCommentId
      })
      .filter((id) => !!id) as string[]
  }, [latestMessageIdsQueries])

  const lastMessageQueries = getPostQuery.useQueries(latestMessageIds ?? [])
  return useMemo(() => {
    const messages = lastMessageQueries?.map((q) => q.data)
    messages.sort(
      (a, b) => (b?.struct.createdAtTime ?? 0) - (a?.struct.createdAtTime ?? 0)
    )

    const hasAddedIds = new Set()
    const sortedIds: string[] = []
    messages.forEach((message) => {
      const id = (message as unknown as CommentData)?.struct.rootPostId
      if (!id) return
      hasAddedIds.add(id)
      sortedIds.push(id)
    })

    const restIds = chatIds.filter((id) => !hasAddedIds.has(id))
    restIds.reverse()
    return [...sortedIds, ...restIds]
  }, [lastMessageQueries, chatIds])
}
