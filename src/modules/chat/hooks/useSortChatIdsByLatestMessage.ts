import { useLastMessageIds } from '@/hooks/useLastMessageId'
import { getPostQuery } from '@/services/api/query'
import { CommentData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useSortChatIdsByLatestMessage(chatIds: string[] = []) {
  const latestMessageIds = useLastMessageIds(chatIds)
  const filteredLatestMessageIds = latestMessageIds?.filter(Boolean) as string[]

  const lastMessageQueries = getPostQuery.useQueries(
    filteredLatestMessageIds ?? []
  )
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
