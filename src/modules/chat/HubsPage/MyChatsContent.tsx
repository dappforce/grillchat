import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import NoChatsFound from '@/components/chats/NoChatsFound'
import Container from '@/components/Container'
import { getPostQuery } from '@/services/api/query'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import Image from 'next/image'
import useSortChatIdsByLatestMessage from '../hooks/useSortChatIdsByLatestMessage'
import { CommonHubContentProps } from './HubsPage'

export type MyChatsContentProps = CommonHubContentProps & {
  search: string
  changeTab: (selectedTab: number) => void
}

export default function MyChatsContent({
  getSearchResults,
  changeTab,
  search,
}: MyChatsContentProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const address = useMyAccount((state) => state.address)

  const { data: chatIds, isLoading } =
    getFollowedPostIdsByAddressQuery.useQuery(address ?? '')

  const sortedIds = useSortChatIdsByLatestMessage(chatIds)

  const chatQueries = getPostQuery.useQueries(sortedIds)
  const chats = chatQueries.map((query) => query.data)

  const { searchResults, focusedElementIndex } = getSearchResults(chats, [
    'content.title',
  ])

  if (!isInitialized || isLoading) {
    return <Loading />
  } else if (!address || searchResults.length === 0) {
    if (search) return <NoChatsFound search={search} />
    return <NoChats changeTab={changeTab} />
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
      {Array.from({ length: 3 }).map((_, idx) => (
        <ChatPreviewSkeleton key={idx} />
      ))}
    </div>
  )
}

function NoChats({ changeTab }: Pick<MyChatsContentProps, 'changeTab'>) {
  return (
    <Container
      as='div'
      className='mt-20 flex !max-w-lg flex-col items-center justify-center gap-4 text-center'
    >
      <Image
        src={NoResultImage}
        className='h-64 w-64'
        alt=''
        role='presentation'
      />
      <span className='text-3xl font-semibold'>😳 No results</span>
      <p className='text-text-muted'>
        It looks like you haven&apos;t joined any chats yet. Don&apos;t worry,
        we&apos;ve got you covered!
      </p>
      <Button className='mt-4 w-full' size='lg' onClick={() => changeTab(1)}>
        View Hot Chats
      </Button>
      <Button
        className='w-full'
        variant='primaryOutline'
        size='lg'
        onClick={() => changeTab(2)}
      >
        Explore Hubs
      </Button>
    </Container>
  )
}
