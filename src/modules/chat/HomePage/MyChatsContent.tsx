import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import ChatPreviewSkeleton from '@/components/chats/ChatPreviewSkeleton'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import { env } from '@/env.mjs'
import { getOwnedPostsQuery } from '@/services/datahub/posts/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { PostData } from '@subsocial/api/types'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { HiOutlineEyeSlash } from 'react-icons/hi2'
import useSortChatIdsByLatestMessage from '../hooks/useSortChatIdsByLatestMessage'

const communityHubId = env.NEXT_PUBLIC_COMMUNITY_HUB_ID

export type MyChatsContentProps = {
  changeTab: (selectedTab: number) => void
}

const filterStorage = new LocalStorage(() => 'my-chats-filter')
const filters = ['all', 'created', 'hidden'] as const
type Filter = (typeof filters)[number]

export default function MyChatsContent({ changeTab }: MyChatsContentProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const address = useMyMainAddress()

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

  const { data: ownedChats } = getOwnedPostsQuery.useQuery(address ?? '')
  const ownedChatIds = useMemo(() => {
    return ownedChats?.map((chat) => chat.id) ?? []
  }, [ownedChats])
  const sortedIds = useSortChatIdsByLatestMessage(ownedChatIds)

  const filteredChats = useMemo(() => {
    if (filter === 'all') return ownedChats
    if (filter === 'hidden') {
      return ownedChats?.filter((chat) => chat?.struct.hidden)
    }
    return ownedChats?.filter((chat) => !chat?.struct.hidden)
  }, [ownedChats, filter])

  const sortedChats = useMemo(() => {
    const chatsMap = new Map<string, PostData>()
    filteredChats?.forEach((chat) => {
      chatsMap.set(chat.id, chat)
    })
    return sortedIds.map((id) => chatsMap.get(id)).filter(Boolean) as PostData[]
  }, [filteredChats, sortedIds])

  const hasAnyHiddenChats = ownedChats?.some((chat) => chat?.struct.hidden)
  const hasAnyMyChat = !!ownedChats?.length

  return (
    <div className='flex flex-col'>
      {hasAnyMyChat && (
        <Toolbar
          filter={filter}
          changeFilter={changeFilter}
          hasAnyHiddenChats={hasAnyHiddenChats}
        />
      )}
      {hasAnyMyChat && filter === 'hidden' && (
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
        if (!isInitialized || filter === null) {
          return <ChatPreviewSkeleton.SkeletonList />
        } else if (!address || !sortedChats?.length) {
          return <NoChats changeTab={changeTab} />
        }
        return <ChatPreviewList chats={sortedChats} />
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
        <div className='flex gap-0.5 text-sm'>
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
        {communityHubId ? (
          <>
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
              onClick={() => changeTab(2)}
            >
              Explore Chats
            </Button>
          </>
        ) : (
          <>
            <Button
              className='mt-4 w-full'
              size='lg'
              onClick={() => changeTab(1)}
            >
              View Recommended Chats
            </Button>
            <Button
              className='w-full'
              variant='primaryOutline'
              size='lg'
              onClick={() => changeTab(2)}
            >
              Explore Hubs
            </Button>
          </>
        )}
      </Container>

      {communityHubId && (
        <NewCommunityModal
          isOpen={isOpenNewCommunity}
          closeModal={() => setIsOpenNewCommunity(false)}
          hubId={communityHubId}
        />
      )}
    </>
  )
}
