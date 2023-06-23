import { getPinnedChatsInHubId } from '@/constants/hubs'
import { useMemo } from 'react'

export function useSortChatIdsByPinned(hubId: string, chatIds: string[]) {
  const pinnedIds = getPinnedChatsInHubId(hubId)

  const sortedIds = useMemo(() => {
    const existPinnedChatIds = pinnedIds.filter((id) => chatIds.includes(id))
    return [
      ...existPinnedChatIds,
      ...chatIds.filter((id) => !existPinnedChatIds.includes(id)),
    ]
  }, [chatIds, pinnedIds])

  return sortedIds
}
