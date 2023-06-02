import ChatPreviewList from '@/components/chats/ChatPreviewList'
import NoChatsFound from '@/components/chats/NoChatsFound'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import dynamic from 'next/dynamic'
import useSortedChats from '../hooks/useSortedChats'
import HomePageNavbar from './HomePageNavbar'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HomePageProps = {
  hubId: string
}
const searchKeys = ['content.title']
export default function HomePage({ hubId }: HomePageProps) {
  const isInIframe = useIsInIframe()

  const { chats, allChatIds } = useSortedChats(hubId)

  const { search, getSearchResults, setSearch, focusController } = useSearch()
  const { focusedElementIndex, searchResults } = getSearchResults(
    chats,
    searchKeys
  )

  return (
    <DefaultLayout
      navbarProps={{
        backButtonProps: {
          defaultBackLink: '/hubs',
          forceUseDefaultBackLink: true,
        },
        customContent: ({
          backButton,
          logoLink,
          authComponent,
          colorModeToggler,
        }) => {
          return (
            <HomePageNavbar
              chatsCount={allChatIds.length}
              auth={authComponent}
              colorModeToggler={colorModeToggler}
              backButton={backButton}
              logo={logoLink}
              spaceId={hubId}
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
      {!isInIframe && <WelcomeModal />}
      <div className='flex flex-col'>
        {searchResults.length === 0 && (
          <NoChatsFound search={search} hubId={hubId} />
        )}
        <ChatPreviewList
          chats={searchResults}
          focusedElementIndex={focusedElementIndex}
        />
      </div>
    </DefaultLayout>
  )
}
