import { getPostExtension } from '@/components/extensions/utils'
import { constantsConfig } from '@/constants/config'
import { getPostQuery } from '@/services/api/query'

export default function usePinnedMessage(chatId: string) {
  const { data: chat } = getPostQuery.useQuery(chatId)
  const pinExtension = getPostExtension(
    chat?.content?.extensions,
    'subsocial-pinned-posts'
  )
  const pinnedMessageId =
    constantsConfig.pinnedMessageInChatId[chatId] ||
    pinExtension?.properties.ids[0]
  return pinnedMessageId
}
