import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedMessageIdsInChatIdQuery,
} from '@/server/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useIsMessageBlocked(
  hubId: string,
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: blockedMessages } = getBlockedMessageIdsInChatIdQuery.useQuery({
    chatId,
    hubId,
  })
  const { data: blockedCids } = getBlockedCidsQuery.useQuery({ hubId })
  const { data: blockedAddresses } = getBlockedAddressesQuery.useQuery({
    hubId,
  })

  const blockedIdsSet = useMemo(
    () => new Set(blockedMessages?.blockedMessageIds),
    [blockedMessages]
  )
  const blockedCidsSet = useMemo(() => new Set(blockedCids), [blockedCids])
  const blockedAddressesSet = useMemo(
    () => new Set(blockedAddresses),
    [blockedAddresses]
  )

  return isMessageBlocked(message, {
    postIds: blockedIdsSet,
    contentIds: blockedCidsSet,
    addresses: blockedAddressesSet,
  })
}
