import { getPostQuery } from '@/services/api/query'
import { useMemo } from 'react'

export default function useSortChatIdsByMembers(chatIds: string[]) {
  const postQueries = getPostQuery.useQueries(chatIds)

  return useMemo(() => {
    const followersData: { followersCount: number; id: string }[] =
      postQueries.map(({ data }, idx) => ({
        followersCount: data?.struct.followersCount ?? 0,
        id: chatIds[idx],
      }))
    followersData.sort((a, b) => {
      return b.followersCount - a.followersCount
    })
    return followersData.map(({ id }) => id)
  }, [postQueries, chatIds])
}
