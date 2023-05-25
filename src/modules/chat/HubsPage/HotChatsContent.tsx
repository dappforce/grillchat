import ChatPreviewList from '@/components/chats/ChatPreviewList'
import NoChatsFound from '@/components/chats/NoChatsFound'
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

  if (searchResults.length === 0) {
    return <NoChatsFound search='' hubId={hubId} />
  }

  return (
    <ChatPreviewList
      chats={searchResults}
      focusedElementIndex={focusedElementIndex}
    />
  )
}
