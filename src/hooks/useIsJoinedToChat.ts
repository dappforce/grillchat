import { useConfigContext } from '@/contexts/ConfigContext'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'

const isJoinedValue = {
  isJoined: true,
  isLoading: false,
}

export default function useIsJoinedToChat(chatId: string, address?: string) {
  const { enableJoinButton } = useConfigContext()
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const myAddress = useMyAccount((state) => state.address)
  const usedAddress = address || myAddress

  const { data, isLoading } = getFollowedPostIdsByAddressQuery.useQuery(
    usedAddress ?? '',
    { enabled: isInitialized }
  )

  const followedPostIdsSet = useMemo(() => {
    const set = new Set<string>()
    data?.forEach((id) => set.add(id))
    return set
  }, [data])

  if (enableJoinButton) {
    return isJoinedValue
  }

  return { isJoined: followedPostIdsSet.has(chatId), isLoading }
}
