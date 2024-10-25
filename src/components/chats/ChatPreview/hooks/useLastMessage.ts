import { useLastMessageId } from '@/components/chats/hooks/useLastMessageId'
import { getPostQuery } from '@/old/services/api/query'

export default function useLastMessage(chatId: string) {
  const lastMessageId = useLastMessageId(chatId)
  return getPostQuery.useQuery(lastMessageId ?? '')
}
