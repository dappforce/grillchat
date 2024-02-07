import { config } from '@/constants/config'
import { useMemo } from 'react'

export function useSortChatIdsByPinned(hubId: string, chatIds: string[]) {
  const pinnedIds = config.pinnedChatsInHubId[hubId]

  const sortedIds = useMemo(() => {
    const existPinnedChatIds = (pinnedIds ?? []).filter((id) =>
      chatIds.includes(id)
    )
    return [
      ...existPinnedChatIds,
      ...chatIds.filter((id) => !existPinnedChatIds.includes(id)),
    ]
  }, [chatIds, pinnedIds])

  return sortedIds
}
