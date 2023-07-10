import CommunityAddIcon from '@/assets/icons/community-add.svg'
import Button from '@/components/Button'
import ChatPreviewList from '@/components/chats/ChatPreviewList'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NewCommunityModal from '@/components/modals/community/NewCommunityModal'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useSearch from '@/hooks/useSearch'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import useSortedChats from '../hooks/useSortedChats'
import SearchChannelsWrapper from '../SearchChannelsWrapper'
import HubPageNavbar from './HubPageNavbar'

export type HubPageProps = {
  hubId: string
}
export default function HubPage({ hubId }: HubPageProps) {
  const { chats, allChatIds } = useSortedChats(hubId)
  const { search, getFocusedElementIndex, setSearch, focusController } =
    useSearch()

  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)
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
            <>
              <Container
                className={cx(
                  'flex items-center justify-between border-b border-border-gray py-2'
                )}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-text-muted'>Sort by:</span>
                  <span className='text-text-primary'>Activity v</span>
                </div>
                <Button
                  size='sm'
                  variant='primaryOutline'
                  className='flex items-center gap-2'
                  onClick={() => setIsOpenNewCommunity(true)}
                >
                  <CommunityAddIcon />
                  <span>New</span>
                </Button>
              </Container>
              <NewCommunityModal
                hubId={hubId}
                closeModal={() => setIsOpenNewCommunity(false)}
                isOpen={isOpenNewCommunity}
              />
            </>
          )}

          <ChatPreviewList chats={chats} />
        </>
      </SearchChannelsWrapper>
    </DefaultLayout>
  )
}
