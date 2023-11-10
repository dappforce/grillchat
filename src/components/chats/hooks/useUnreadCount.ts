import { getMessagesCountAfterTimeQuery } from '@/services/subsocial/commentIds'
import { getUnreadCountQuery } from '@/services/subsocial/datahub/posts/query'
import { getDatahubConfig } from '@/utils/env/client'

export default function useUnreadCount(chatId: string, lastReadTime: number) {
  if (getDatahubConfig()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUnreadCountFromDatahub(chatId, lastReadTime)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUnreadCountFromBlockchain(chatId, lastReadTime)
  }
}

function useUnreadCountFromDatahub(chatId: string, lastReadTime: number) {
  const { data: unreadCountFromDatahub } = getUnreadCountQuery.useQuery(
    { chatId: chatId, lastRead: { timestamp: lastReadTime } },
    {
      enabled: !!lastReadTime,
    }
  )
  return unreadCountFromDatahub ?? 0
}

function useUnreadCountFromBlockchain(chatId: string, lastReadTime: number) {
  const { data } = getMessagesCountAfterTimeQuery.useQuery({
    chatId,
    time: lastReadTime,
  })

  return data?.totalCount ?? 0
}
