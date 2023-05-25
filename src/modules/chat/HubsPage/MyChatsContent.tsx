import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
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
  const { data: chatIds, isLoading } =
    getFollowedPostIdsByAddressQuery.useQuery(address ?? '')

  const sortedIds = useSortChatIdsByLatestMessage(chatIds)

  const chatQueries = getPostQuery.useQueries(sortedIds)
  const chats = chatQueries.map((query) => query.data)

  const { searchResults, focusedElementIndex } = getSearchResults(chats, [
    'content.title',
  ])

  if (isLoading) {
    return <Loading />
  } else if (!address || searchResults.length === 0) {
    return <NoResult />
  }

  return (
    <ChatPreviewList
      chats={searchResults}
      focusedElementIndex={focusedElementIndex}
    />
  )
}

function Loading() {
  return (
    <div className='flex flex-col'>
      <ChatPreviewSkeleton asContainer />
      <ChatPreviewSkeleton asContainer />
      <ChatPreviewSkeleton asContainer />
    </div>
  )
}

function NoResult() {
  return <div>asdfasdf</div>
}
