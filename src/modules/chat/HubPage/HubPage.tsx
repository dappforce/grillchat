import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useSearch from '@/hooks/useSearch'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import HomePage from '../HomePage'
import useSortedChats, {
  SortChatOption,
  sortChatOptions,
} from '../hooks/useSortedChats'

const sortByStorage = new LocalStorage(() => 'hub-sort-by')
export type HubPageProps = {
  hubId: string
}
export default function HubPage({ hubId }: HubPageProps) {
  const isCommunityHub = hubId === COMMUNITY_CHAT_HUB_ID

  const [sortBy, setSortBy] = useState<SortChatOption | null>(null)
  useEffect(() => {
    const savedSortBy =
      isCommunityHub && (sortByStorage.get() as SortChatOption)
    if (savedSortBy && sortChatOptions.includes(savedSortBy)) {
      setSortBy(savedSortBy)
    } else {
      setSortBy('activity')
    }
  }, [isCommunityHub])
  const changeSortBy = (sortBy: SortChatOption) => {
    setSortBy(sortBy)
    sortByStorage.set(sortBy)
  }

  const { chats, allChatIds } = useSortedChats(hubId, sortBy ?? 'activity')
  const { search, getFocusedElementIndex, setSearch, focusController } =
    useSearch()

  return (
    <div>
      <HomePage />
    </div>
  )
}
