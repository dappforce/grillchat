import { useLastMessages } from '@/components/chats/hooks/useLastMessageId'

export default function useSortChatIdsByLatestMessage(chatIds: string[] = []) {
  const latestMessages = useLastMessages(chatIds)

  latestMessages.sort(
    (a, b) => (b?.createdAtTime ?? 0) - (a?.createdAtTime ?? 0)
  )

  const hasAddedIds = new Set()
  const sortedIds: string[] = []
  latestMessages.forEach((message) => {
    const id = message.rootPostId
    if (!id) return
    hasAddedIds.add(id)
    sortedIds.push(id)
  })

  const restIds = chatIds.filter((id) => !hasAddedIds.has(id))
  restIds.reverse()
  return [...sortedIds, ...restIds]
}
