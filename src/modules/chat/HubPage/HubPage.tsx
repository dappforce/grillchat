import Container from '@/components/Container'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import FloatingMenus from '@/components/floating/FloatingMenus'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { isCommunityHubId } from '@/constants/config'
import useSearch from '@/hooks/useSearch'
import { useSendEvent } from '@/stores/analytics'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import {
  HiChevronDown,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineClock,
  HiOutlineUsers,
} from 'react-icons/hi2'
import CreateChatButton from '../HomePage/CreateChatButton'
import SearchChannelsWrapper from '../SearchChannelsWrapper'
import useSortedChats, {
  SortChatOption,
  sortChatOptions,
} from '../hooks/useSortedChats'
import HubPageNavbar from './HubPageNavbar'

const sortByStorage = new LocalStorage(() => 'hub-sort-by')
export type HubPageProps = {
  hubId: string
}
export default function HubPage({ hubId }: HubPageProps) {
  const isCommunityHub = isCommunityHubId(hubId)

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
    <DefaultLayout
      withSidebar
      navbarProps={{
        customContent: ({
          backButton,
          logoLink,
          authComponent,
          notificationBell,
          hamburgerMenu,
          newPostButton,
        }) => {
          return (
            <HubPageNavbar
              hamburgerMenu={hamburgerMenu}
              chatsCount={allChatIds.length}
              auth={authComponent}
              newPostButton={newPostButton}
              notificationBell={notificationBell}
              backButton={backButton}
              logo={logoLink}
              hubId={hubId}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      <SearchChannelsWrapper
        localSearch={{
          data: chats,
          searchKeys: ['content.title'],
        }}
        getFocusedElementIndex={getFocusedElementIndex}
        search={search}
      >
        {sortBy ? (
          <>
            {isCommunityHub && (
              <CommunityHubToolbar
                sortBy={sortBy}
                changeSortBy={changeSortBy}
                hubId={hubId}
              />
            )}
            <ChatPreviewList chatInfo={sortBy} chats={chats} hubId={hubId} />
          </>
        ) : null}
      </SearchChannelsWrapper>
    </DefaultLayout>
  )
}

type CommunityHubToolbarProps = {
  hubId: string
  sortBy: SortChatOption
  changeSortBy: (sortBy: SortChatOption) => void
}
function CommunityHubToolbar({
  hubId,
  sortBy,
  changeSortBy,
}: CommunityHubToolbarProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const { openModal } = useCreateChatModal()
  const sendEvent = useSendEvent()

  return (
    <>
      <Container
        className={cx(
          'flex items-center justify-between border-b border-border-gray py-2'
        )}
      >
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-text-muted'>Sort by:</span>
          <FloatingMenus
            menus={[
              {
                text: 'Recent activity',
                icon: HiOutlineClock,
                onClick: () => changeSortBy('activity'),
              },
              {
                text: 'Messages count',
                icon: HiOutlineChatBubbleOvalLeftEllipsis,
                onClick: () => changeSortBy('messages'),
              },
              {
                text: 'Members count',
                icon: HiOutlineUsers,
                onClick: () => changeSortBy('members'),
              },
            ]}
            allowedPlacements={['bottom-start']}
            mainAxisOffset={4}
            panelSize='xs'
          >
            {(config) => {
              const { referenceProps, toggleDisplay, isOpen } = config || {}
              return (
                <div
                  {...referenceProps}
                  onClick={toggleDisplay}
                  className='flex cursor-pointer items-center gap-1 text-text-primary'
                >
                  <span className='capitalize'>{sortBy}</span>
                  <HiChevronDown
                    className={cx(
                      'transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
              )
            }}
          </FloatingMenus>
        </div>
        <CreateChatButton />
      </Container>
    </>
  )
}
