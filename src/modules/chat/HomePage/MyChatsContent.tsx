import NoResultImage from '@/assets/graphics/no-result.png'
import CommunityAddIcon from '@/assets/icons/community-add.svg'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import Container from '@/components/Container'
import NewCommunityModal from '@/components/modals/community/NewCommunityModal'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import { getPostQuery } from '@/services/api/query'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { useState } from 'react'
import useSortChatIdsByLatestMessage from '../hooks/useSortChatIdsByLatestMessage'

export type MyChatsContentProps = {
  changeTab: (selectedTab: number) => void
}

const filters = ['all', 'created', 'joined'] as const
type Filter = (typeof filters)[number]

export default function MyChatsContent({ changeTab }: MyChatsContentProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const address = useMyAccount((state) => state.address)

  const [filter, setFilter] = useState<Filter>('all')

  const {
    data: chatIds,
    isLoading,
    isPlaceholderData,
  } = getFollowedPostIdsByAddressQuery.useQuery(address ?? '')

  const sortedIds = useSortChatIdsByLatestMessage(chatIds)

  const chatQueries = getPostQuery.useQueries(sortedIds)
  const chats = chatQueries.map((query) => query.data)

  return (
    <div className='flex flex-col'>
      <Toolbar filter={filter} setFilter={setFilter} />
      {(() => {
        if (!isInitialized || isLoading || isPlaceholderData) {
          return <ChatPreviewSkeleton.SkeletonList />
        } else if (!address || chats.length === 0) {
          return <NoChats changeTab={changeTab} />
        }
        return <ChatPreviewList chats={chats} />
      })()}
    </div>
  )
}

type ToolbarProps = {
  filter: Filter
  setFilter: (filter: Filter) => void
}
function Toolbar({ filter, setFilter }: ToolbarProps) {
  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)

  return (
    <>
      <Container as='div'>
        <div className='flex justify-between gap-4 border-b border-border-gray py-2'>
          <div className='flex gap-0.5'>
            {filters.map((text) => {
              const isActive = text === filter

              return (
                <Button
                  key={text}
                  size='sm'
                  variant='transparent'
                  onClick={() => setFilter(text)}
                  className={cx(
                    'capitalize',
                    isActive
                      ? 'bg-background-light text-text-primary'
                      : 'text-text-muted'
                  )}
                >
                  {text}
                </Button>
              )
            })}
          </div>
          <Button
            size='sm'
            variant='primaryOutline'
            className='flex items-center gap-2'
            onClick={() => setIsOpenNewCommunity(true)}
          >
            <CommunityAddIcon className='text-text-muted' />
            <span>New</span>
          </Button>
        </div>
      </Container>

      <NewCommunityModal
        isOpen={isOpenNewCommunity}
        closeModal={() => setIsOpenNewCommunity(false)}
        hubId={COMMUNITY_CHAT_HUB_ID}
      />
    </>
  )
}

function NoChats({ changeTab }: Pick<MyChatsContentProps, 'changeTab'>) {
  return (
    <Container
      as='div'
      className='mb-8 mt-12 flex !max-w-lg flex-col items-center justify-center gap-4 text-center md:mt-20'
    >
      <Image
        src={NoResultImage}
        className='h-48 w-48'
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
