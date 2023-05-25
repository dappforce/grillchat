import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'

export default function useIsJoinedToChat(chatId: string, address?: string) {
  const myAddress = useMyAccount((state) => state.address)
  const usedAddress = address || myAddress

  const { data } = getFollowedPostIdsByAddressQuery.useQuery(usedAddress ?? '')

  const followedPostIdsSet = useMemo(() => {
    const set = new Set<string>()
    data?.forEach((id) => set.add(id))
    return set
  }, [data])

  return followedPostIdsSet.has(chatId)
}
