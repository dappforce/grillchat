import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useMemo } from 'react'
import useSortChatIdsByConfig from './useSortChatIdsByConfig'
import useSortChatIdsByLatestMessage from './useSortChatIdsByLatestMessage'

export default function useSortedChats(hubId: string) {
  const { channels } = useConfigContext()

  const { data } = getPostIdsBySpaceIdQuery.useQuery(hubId)
  const allChatIds = useMemo(() => {
    return [...(data?.postIds ?? []), ...getLinkedChatIdsForHubId(hubId)]
  }, [data, hubId])

  const filteredChatIds = useMemo(() => {
    return allChatIds.filter((id) => !channels || channels?.has(id))
  }, [allChatIds, channels])

  const sortedIds = useSortChatIdsByLatestMessage(filteredChatIds)
  const order = useSortChatIdsByConfig(sortedIds)

  const chatQueries = getPostQuery.useQueries(order)
  const chats = useMemo(
    () => chatQueries.map(({ data }) => data),
    [chatQueries]
  )

  return { chats, allChatIds }
}
