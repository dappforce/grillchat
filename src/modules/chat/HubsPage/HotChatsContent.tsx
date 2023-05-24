import ChatPreviewList from '@/components/chats/ChatPreviewList'
import useSortedChats from '../hooks/useSortedChats'
import { CommonHubContentProps } from './HubsPage'

export type HotChatsContentProps = CommonHubContentProps & {
  hubId: string
}

export default function HotChatsContent({
  getSearchResults,
  hubId,
}: HotChatsContentProps) {
  const { chats } = useSortedChats(hubId)

  const { searchResults, focusedElementIndex } = getSearchResults(chats, [
    'content.title',
  ])

  return (
    <ChatPreviewList
      chats={searchResults}
      focusedElementIndex={focusedElementIndex}
    />
  )
}
