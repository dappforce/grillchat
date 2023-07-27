import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'
import useIsInIframe from './useIsInIframe'

const isJoinedValue = {
  isJoined: true,
  isLoading: false,
}

export default function useIsJoinedToChat(chatId: string, address?: string) {
  const isInIframe = useIsInIframe()

  const myAddress = useMyAccount((state) => state.address)
  const usedAddress = address || myAddress

  const isEnabledQuery = !!usedAddress
  const { data, isLoading } = getFollowedPostIdsByAddressQuery.useQuery(
    usedAddress ?? '',
    { enabled: isEnabledQuery }
  )

  const followedPostIdsSet = useMemo(() => {
    const set = new Set<string>()
    data?.forEach((id) => set.add(id))
    return set
  }, [data])

  if (isInIframe) {
    return isJoinedValue
  }

  return {
    isJoined: followedPostIdsSet.has(chatId),
    isLoading: isEnabledQuery && isLoading,
  }
}
