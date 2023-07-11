import CommunityAddIcon from '@/assets/icons/community-add.svg'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import Container from '@/components/Container'
import FloatingMenus from '@/components/floating/FloatingMenus'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NewCommunityModal from '@/components/modals/community/NewCommunityModal'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useSearch from '@/hooks/useSearch'
import { cx } from '@/utils/class-names'
import React, { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'
import useSortedChats, { SortChatOption } from '../hooks/useSortedChats'
import SearchChannelsWrapper from '../SearchChannelsWrapper'
import HubPageNavbar from './HubPageNavbar'

export type HubPageProps = {
  hubId: string
}
export default function HubPage({ hubId }: HubPageProps) {
  const [sortBy, setSortBy] = useState<'activity' | 'size' | 'members'>(
    'activity'
  )

  const { chats, allChatIds } = useSortedChats(hubId, sortBy)
  const { search, getFocusedElementIndex, setSearch, focusController } =
    useSearch()

  const isCommunityHub = hubId === COMMUNITY_CHAT_HUB_ID

  return (
    <DefaultLayout
      navbarProps={{
        customContent: ({
          backButton,
          logoLink,
          authComponent,
          colorModeToggler,
        }) => {
          return (
            <HubPageNavbar
              chatsCount={allChatIds.length}
              auth={authComponent}
              colorModeToggler={colorModeToggler}
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
        <>
          {isCommunityHub && (
            <CommunityHubToolbar
              sortBy={sortBy}
              setSortBy={setSortBy}
              hubId={hubId}
            />
          )}
          <ChatPreviewList chats={chats} />
        </>
      </SearchChannelsWrapper>
    </DefaultLayout>
  )
}

type CommunityHubToolbarProps = {
  hubId: string
  sortBy: SortChatOption
  setSortBy: React.Dispatch<React.SetStateAction<SortChatOption>>
}
function CommunityHubToolbar({
  hubId,
  sortBy,
  setSortBy,
}: CommunityHubToolbarProps) {
  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)

  return (
    <>
      <Container
        className={cx(
          'flex items-center justify-between border-b border-border-gray py-2'
        )}
      >
        <div className='flex items-center gap-2'>
          <span className='text-text-muted'>Sort by:</span>
          <FloatingMenus
            menus={[
              {
                text: 'Activity',
                icon: HiChevronDown,
                onClick: () => setSortBy('activity'),
              },
              {
                text: 'Size',
                icon: HiChevronDown,
                onClick: () => setSortBy('size'),
              },
            ]}
            allowedPlacements={['bottom-start']}
            mainAxisOffset={4}
            panelSize='xs'
            showOnHover
          >
            {(config) => {
              const { referenceProps } = config || {}
              return (
                <div
                  {...referenceProps}
                  className='flex items-center gap-1 text-text-primary'
                >
                  <span className='capitalize'>{sortBy}</span>
                  <HiChevronDown />
                </div>
              )
            }}
          </FloatingMenus>
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
      </Container>
      <NewCommunityModal
        hubId={hubId}
        closeModal={() => setIsOpenNewCommunity(false)}
        isOpen={isOpenNewCommunity}
      />
    </>
  )
}
