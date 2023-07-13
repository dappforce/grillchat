import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'
import useSortChatIdsByConfig from './useSortChatIdsByConfig'
import useSortChatIdsByLatestMessage from './useSortChatIdsByLatestMessage'
import { useSortChatIdsByPinned } from './useSortChatIdsByPinned'
import useSortChatIdsBySize from './useSortChatIdsBySize'

export type SortChatOption = 'activity' | 'size' | 'members'
export default function useSortedChats(
  hubId: string,
  sortBy: SortChatOption = 'activity'
) {
  const { channels } = useConfigContext()

  const { data } = getPostIdsBySpaceIdQuery.useQuery(hubId)
  const allChatIds = useMemo(() => {
    return [...(data?.postIds ?? []), ...getLinkedChatIdsForHubId(hubId)]
  }, [data, hubId])

  const filteredChatIds = useMemo(() => {
    return allChatIds.filter((id) => !channels || channels?.has(id))
  }, [allChatIds, channels])

  const sortedIdsByActivity = useSortChatIdsByLatestMessage(filteredChatIds)
  const sortedIdsBySize = useSortChatIdsBySize(filteredChatIds)
  // const sortedIdsByMembers = useSortChatIdsByMembers(filteredChatIds)

  let sortedIds: string[] = []
  switch (sortBy) {
    case 'activity':
      sortedIds = sortedIdsByActivity
      break
    case 'size':
      sortedIds = sortedIdsBySize
      break
    // case 'members':
    //   sortedIds = sortedIdsByMembers
    //   break
  }

  const sortedByOrder = useSortChatIdsByConfig(sortedIds)
  const sortedByPinned = useSortChatIdsByPinned(hubId, sortedByOrder)

  const myAddress = useMyAccount((state) => state.address)
  const chatQueries = getPostQuery.useQueries(sortedByPinned, {
    showHiddenPost: { type: 'owner', owner: myAddress ?? '' },
  })
  const chats = useMemo(
    () => chatQueries.map(({ data }) => data),
    [chatQueries]
  )

  return { chats, allChatIds }
}
