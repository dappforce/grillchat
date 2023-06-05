import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import Tabs, { TabsProps } from '@/components/Tabs'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { getMainHubId } from '@/utils/env/client'
import { replaceUrl } from '@/utils/window'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HotChatsContent from './HotChatsContent'
import HubsContent from './HubsContent'
import MyChatsContent from './MyChatsContent'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HubsPageProps = {
  isIntegrateChatButtonOnTop: boolean
  hubsChatCount: { [id: string]: number }
}

export type CommonHubContentProps = {
  getSearchResults: ReturnType<typeof useSearch>['getSearchResults']
}

const hotChatsHubId = getMainHubId()
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

  const myAddress = useMyAccount((state) => state.address)
  const { data: followedPostIds } = getFollowedPostIdsByAddressQuery.useQuery(
    myAddress ?? ''
  )

  const [isTabUrlLoaded, setIsTabUrlLoaded] = useState(false)
  const [selectedTab, setSelectedTab] = useState(1)
  const { isReady } = useRouter()
  useEffect(() => {
    if (!isReady) return

    const currentPathname = window.location.pathname.substring(1)
    if (!currentPathname) {
      if (followedPostIds?.length) {
        setSelectedTab(0)
        replaceUrl('/my-chats')
      } else {
        setSelectedTab(1)
        replaceUrl('/hot-chats')
      }
    } else {
      const index = tabs.findIndex(({ id }) => id === currentPathname)
      if (index > -1) setSelectedTab(index)
    }

    setIsTabUrlLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  const usedSelectedTab = isTabUrlLoaded ? selectedTab : -1
  const usedSetSelectedTab = (selectedTab: number) => {
    setSelectedTab(selectedTab)
    const selectedTabId = tabs[selectedTab]?.id
    if (selectedTabId) replaceUrl(`/${selectedTabId}`)
  }

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
        className='border-b border-border-gray bg-background-light md:bg-background-light/50'
        panelClassName='mt-0 px-0'
        asContainer
        tabs={tabs}
        withHashIntegration={false}
        manualTabControl={{
          selectedTab: usedSelectedTab,
          setSelectedTab: usedSetSelectedTab,
        }}
      />
      {!isInIframe && <WelcomeModal />}
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
