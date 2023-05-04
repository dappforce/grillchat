import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedIdsInRootPostIdQuery,
} from '@/services/moderation/query'
import { isMessageBlocked } from '@/utils/chat'
import { PostData } from '@subsocial/api/types'
import { useMemo } from 'react'

export default function useIsMessageBlocked(
  message: PostData | null | undefined,
  chatId: string
) {
  const { data: blockedIds } = getBlockedIdsInRootPostIdQuery.useQuery(chatId)
  const { data: blockedCids } = getBlockedCidsQuery.useQuery(null)
  const { data: blockedAddresses } = getBlockedAddressesQuery.useQuery(null)

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
