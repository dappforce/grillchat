import { getLinkedChatIdsForSpaceId } from '@/constants/chat-room'
import { useConfigContext } from '@/contexts/ConfigContext'
import useMounted from '@/hooks/useMounted'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostIds } from '@/services/subsocial/commentIds'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { CommentData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useSortedChats(hubId: string) {
  const { data } = getChatIdsBySpaceIdQuery.useQuery(hubId)
  const allChatIds = useMemo(() => {
    return [...(data?.chatIds ?? []), ...getLinkedChatIdsForSpaceId(hubId)]
  }, [data, hubId])

  const sortedIds = useSortedChatIdsByLatestMessage(allChatIds)
  const order = useSortByConfig(sortedIds)

  const chatQueries = getPostQuery.useQueries(order)
  const chats = useMemo(
    () => chatQueries.map(({ data }) => data),
    [chatQueries]
  )

  return { chats, allChatIds }
}

function useSortByConfig(originalOrder: string[]) {
  const { order } = useConfigContext()
  const mounted = useMounted()

  if (mounted && order) {
    if (order.length === 0) return originalOrder
    const filteredOrder = order.filter((item) => originalOrder.includes(item))
    return [
      ...filteredOrder,
      ...originalOrder.filter((item) => !filteredOrder.includes(item)),
    ]
  }
  return originalOrder
}

function useSortedChatIdsByLatestMessage(chatIds: string[] = []) {
  const messageIdsQueries = useCommentIdsByPostIds(chatIds, {
    subscribe: true,
  })
  const latestMessageIds = useMemo(() => {
    return messageIdsQueries?.map((query) => {
      const ids = query.data
      return ids?.[ids?.length - 1] ?? null
    })
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
    return [...sortedIds, ...restIds]
  }, [lastMessageQueries, chatIds])
}
