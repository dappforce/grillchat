import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedMessageIdsInChatIdQuery,
} from '@/services/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useIsMessageBlocked(
  hubId: string,
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: blockedIds } = getBlockedMessageIdsInChatIdQuery.useQuery({
    chatId,
    hubId,
  })
  const { data: blockedCids } = getBlockedCidsQuery.useQuery({ hubId })
  const { data: blockedAddresses } = getBlockedAddressesQuery.useQuery({
    hubId,
  })

  const blockedIdsSet = useMemo(() => new Set(blockedIds), [blockedIds])
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
