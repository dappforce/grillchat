import ChatPreviewList from '@/components/chats/ChatPreviewList'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useSearch from '@/hooks/useSearch'
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
        getFocusedElementIndex={getFocusedElementIndex}
        search={search}
      >
        <ChatPreviewList chats={chats} />
      </SearchChannelsWrapper>
    </DefaultLayout>
  )
}
