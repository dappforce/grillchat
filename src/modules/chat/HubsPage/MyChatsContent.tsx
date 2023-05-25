import ChatPreviewList from '@/components/chats/ChatPreviewList'
import { getPostQuery } from '@/services/api/query'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import useSortChatIdsByLatestMessage from '../hooks/useSortChatIdsByLatestMessage'
import { CommonHubContentProps } from './HubsPage'

export type MyChatsContentProps = CommonHubContentProps

export default function MyChatsContent({
  getSearchResults,
}: MyChatsContentProps) {
  const address = useMyAccount((state) => state.address)
  const { data: chatIds } = getFollowedPostIdsByAddressQuery.useQuery(
    address ?? ''
  )

  const sortedIds = useSortChatIdsByLatestMessage(chatIds)

  const chatQueries = getPostQuery.useQueries(sortedIds)
  const chats = chatQueries.map((query) => query.data)

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
