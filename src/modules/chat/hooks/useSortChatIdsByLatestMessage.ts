import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostIds } from '@/services/subsocial/commentIds'
import { CommentData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useSortChatIdsByLatestMessage(chatIds: string[] = []) {
  const messageIdsQueries = useCommentIdsByPostIds(chatIds, {
    subscribe: true,
  })
  const latestMessageIds = useMemo(() => {
    return messageIdsQueries
      ?.map((query) => {
        const ids = query.data
        return ids?.[ids?.length - 1] ?? null
      })
      .filter((id) => !!id) as string[]
  }, [messageIdsQueries])

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
