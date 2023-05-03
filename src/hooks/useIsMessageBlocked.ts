import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedMessageIdsInChatIdQuery,
} from '@/services/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'

export default function useIsMessageBlocked(
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: blockedIds } =
    getBlockedMessageIdsInChatIdQuery.useQuery(chatId)
  const { data: blockedCids } = getBlockedCidsQuery.useQuery(null)
  const { data: blockedAddresses } = getBlockedAddressesQuery.useQuery(null)

  return isMessageBlocked(message, {
    addresses: blockedAddresses ?? [],
    contentIds: blockedCids ?? [],
    postIds: blockedIds ?? [],
  })
}
