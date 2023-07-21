import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import Container from '@/components/Container'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import { getPostQuery } from '@/services/api/query'
import {
  getFollowedPostIdsByAddressQuery,
  getOwnedPostIdsQuery,
} from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import useSortChatIdsByLatestMessage from '../hooks/useSortChatIdsByLatestMessage'

export type MyChatsContentProps = {
  changeTab: (selectedTab: number) => void
}

const filterStorage = new LocalStorage(() => 'my-chats-filter')
const filters = ['all', 'created', 'joined', 'hidden'] as const
type Filter = (typeof filters)[number]

export default function MyChatsContent({ changeTab }: MyChatsContentProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const address = useMyAccount((state) => state.address)

  const [filter, setFilter] = useState<Filter | null>(null)
  const changeFilter = (filter: Filter) => {
    setFilter(filter)
    filterStorage.set(filter)
  }
  useEffect(() => {
    const savedFilter = filterStorage.get() as (typeof filters)[number]
    if (savedFilter && filters.includes(savedFilter)) {
      setFilter(savedFilter)
    } else {
      setFilter('all')
    }
  }, [])

  const {
    data: followedChatIds,
    isLoading,
    isPlaceholderData,
  } = getFollowedPostIdsByAddressQuery.useQuery(address ?? '')
  const { data: ownedChatIds } = getOwnedPostIdsQuery.useQuery(address ?? '')

  const chatIds = useMemo<string[]>(() => {
    const owned = ownedChatIds ?? []
    const followed = followedChatIds ?? []

    if (filter === 'all') return Array.from(new Set([...owned, ...followed]))
    if (filter === 'created' || filter === 'hidden') return owned
    if (filter === 'joined') return followed

    return []
  }, [ownedChatIds, followedChatIds, filter])

  const sortedIds = useSortChatIdsByLatestMessage(chatIds)

  const chatQueries = getPostQuery.useQueries(sortedIds, {
    showHiddenPost: { type: 'owner', owner: address ?? '' },
  })
  const chats = chatQueries.map((query) => query.data)

  const hasAnyHiddenChats = chats.some((chat) => chat?.struct.hidden)
  const filteredChats = useMemo(() => {
    if (filter === 'hidden') {
      return chats.filter((chat) => chat?.struct.hidden)
    }
    return chats.filter((chat) => !chat?.struct.hidden)
  }, [chats, filter])

  return (
    <div className='flex flex-col'>
      <Toolbar
        filter={filter}
        changeFilter={changeFilter}
        hasAnyHiddenChats={hasAnyHiddenChats}
      />
      {filter === 'hidden' && (
        <Container>
          <div className='my-2 flex items-center gap-2 rounded-2xl bg-orange-500/10 px-4 py-2 text-orange-500'>
            <HiOutlineEyeSlash className='flex-shrink-0' />
            <span>
              Only you can see these group chats. Other people will not see them
              on Grill
            </span>
          </div>
        </Container>
      )}
      {(() => {
        if (!isInitialized || isLoading || isPlaceholderData) {
          return <ChatPreviewSkeleton.SkeletonList />
        } else if (!address || filteredChats.length === 0) {
          return <NoChats changeTab={changeTab} />
        }
        return <ChatPreviewList chats={filteredChats} />
      })()}
    </div>
  )
}

type ToolbarProps = {
  filter: Filter | null
  changeFilter: (filter: Filter) => void
  hasAnyHiddenChats?: boolean
}
function Toolbar({ filter, changeFilter, hasAnyHiddenChats }: ToolbarProps) {
  return (
    <Container as='div' className='border-b border-border-gray'>
      <div className='flex justify-between gap-4 py-2'>
        <div className='flex gap-0.5'>
          {filters.map((text) => {
            if (!hasAnyHiddenChats && text === 'hidden') return null

            const isActive = text === filter
            return (
              <Button
                key={text}
                size='sm'
                variant='transparent'
                onClick={() => changeFilter(text)}
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
      </div>
    </Container>
  )
}

type NoChatsProps = Pick<MyChatsContentProps, 'changeTab'>
function NoChats({ changeTab }: NoChatsProps) {
  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)

  return (
    <>
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
        <span className='text-3xl font-semibold'>🤗 Welcome to your chats</span>
        <p className='text-text-muted'>
          Here will be all the chats you joined or created
        </p>
        <Button
          className='mt-4 w-full'
          size='lg'
          onClick={() => setIsOpenNewCommunity(true)}
        >
          Create Chat
        </Button>
        <Button
          className='w-full'
          variant='primaryOutline'
          size='lg'
          onClick={() => changeTab(1)}
        >
          Explore Chats
        </Button>
      </Container>

      <NewCommunityModal
        isOpen={isOpenNewCommunity}
        closeModal={() => setIsOpenNewCommunity(false)}
        hubId={COMMUNITY_CHAT_HUB_ID}
      />
    </>
  )
}
