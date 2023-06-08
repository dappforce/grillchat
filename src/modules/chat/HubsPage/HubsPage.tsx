import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import Tabs, { TabsProps } from '@/components/Tabs'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getMainSpaceId } from '@/utils/env/client'
// import dynamic from 'next/dynamic'
import HotChatsContent from './HotChatsContent'
import HubsContent from './HubsContent'
import MyChatsContent from './MyChatsContent'

// const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
//   ssr: false,
// })

export type HubsPageProps = {
  isIntegrateChatButtonOnTop: boolean
  hubsChatCount: { [id: string]: number }
}

export type CommonHubContentProps = {
  getSearchResults: ReturnType<typeof useSearch>['getSearchResults']
}

const hotChatsHubId = getMainSpaceId()
export default function HubsPage(props: HubsPageProps) {
  const isInIframe = useIsInIframe()
  const { search, setSearch, getSearchResults, focusController } = useSearch()

  const renderHubsContent = (
    children: JSX.Element,
    showSpecialButtons?: boolean
  ) => {
    return (
      <HubsContentWrapper
        search={search}
        isIntegrateChatButtonOnTop={props.isIntegrateChatButtonOnTop}
        showSpecialButtons={showSpecialButtons}
      >
        {children}
      </HubsContentWrapper>
    )
  }

  const tabs: TabsProps['tabs'] = [
    {
      id: 'my-chats',
      text: 'My Chats',
      content: (setSelectedTab) =>
        renderHubsContent(
          <MyChatsContent
            changeTab={setSelectedTab}
            search={search}
            getSearchResults={getSearchResults}
          />
        ),
    },
    {
      id: 'hot-chats',
      text: 'Hot Chats',
      content: () =>
        renderHubsContent(
          <HotChatsContent
            getSearchResults={getSearchResults}
            hubId={hotChatsHubId}
          />
        ),
    },
    {
      id: 'hubs',
      text: 'Hubs',
      content: () =>
        renderHubsContent(
          <HubsContent
            getSearchResults={getSearchResults}
            hubsChatCount={props.hubsChatCount}
          />,
          true
        ),
    },
  ]

  return (
    <DefaultLayout
      navbarProps={{
        customContent: ({ logoLink, authComponent, colorModeToggler }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-2'>
                    {searchButton}
                    {colorModeToggler}
                    <div className='ml-1.5'>{authComponent}</div>
                  </div>
                </div>
              )}
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
      <Tabs
        className='border-b border-border-gray bg-background-light px-4 md:bg-background-light/50'
        panelClassName='mt-0 px-0'
        asContainer
        tabs={tabs}
        defaultTab={1}
        hideBeforeHashLoaded
      />
      {/* {!isInIframe && <WelcomeModal />} */}
    </DefaultLayout>
  )
}

function HubsContentWrapper({
  isIntegrateChatButtonOnTop,
  children,
  search,
  showSpecialButtons,
}: {
  isIntegrateChatButtonOnTop: boolean
  children: JSX.Element
  search: string
  showSpecialButtons?: boolean
}) {
  const isInIframe = useIsInIframe()
  return (
    <div className='flex flex-col'>
      {showSpecialButtons && !isInIframe && !search && (
        <ChatSpecialButtons
          isIntegrateChatButtonOnTop={isIntegrateChatButtonOnTop}
        />
      )}
      {children}
    </div>
  )
}
