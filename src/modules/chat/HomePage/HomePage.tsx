import CommunityAddIcon from '@/assets/icons/community-add.svg'
import Button from '@/components/Button'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import Tabs, { TabsProps } from '@/components/Tabs'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useSearch from '@/hooks/useSearch'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { useLocation } from '@/stores/location'
import { accountAddressStorage, useMyAccount } from '@/stores/my-account'
import { getMainHubId } from '@/utils/env/client'
import { replaceUrl } from '@/utils/window'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SearchChannelsWrapper from '../SearchChannelsWrapper'
import HotChatsContent from './HotChatsContent'
import HubsContent from './HubsContent'
import MyChatsContent from './MyChatsContent'

export type HubsPageProps = {
  hubsChatCount: { [id: string]: number }
}

const hotChatsHubId = getMainHubId()
const addressFromStorage = accountAddressStorage.get()

export const homePageAdditionalTabs: {
  id: string
  text: string
  hubId: string
}[] = [
  // Example additional tabs
  // {
  //   id: 'decoded',
  //   text: 'Decoded',
  //   hubId: '1023',
  // },
]

const pathnameTabIdMapper: Record<string, number> = {
  '/my-chats': 0,
  '/hot-chats': 1,
  '/hubs': 2,
}

export default function HubsPage(props: HubsPageProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const router = useRouter()
  const sendEvent = useSendEvent()
  const isFirstAccessed = useLocation((state) => state.isFirstAccessed)
  const { search, setSearch, getFocusedElementIndex, focusController } =
    useSearch()

  const tabs: TabsProps['tabs'] = [
    {
      id: 'my-chats',
      text: 'My Chats',
      content: (setSelectedTab) => (
        <MyChatsContent changeTab={setSelectedTab} />
      ),
    },
    ...homePageAdditionalTabs.map(({ id, text, hubId }) => ({
      id,
      text,
      content: () => <HotChatsContent hubId={hubId} />,
    })),
    {
      id: 'hot-chats',
      text: 'Hot Chats',
      content: () => <HotChatsContent hubId={hotChatsHubId} />,
    },
    {
      id: 'hubs',
      text: 'Hubs',
      content: () => <HubsContent hubsChatCount={props.hubsChatCount} />,
    },
  ]

  const myAddress = useMyAccount((state) => state.address)
  const { data: followedPostIds } = getFollowedPostIdsByAddressQuery.useQuery(
    myAddress ?? addressFromStorage ?? ''
  )

  // If user is accessing page for the first time, we can't use the `asPath` because it will cause hydration error because of rewrites
  const currentTabId = isFirstAccessed
    ? undefined
    : pathnameTabIdMapper[router.asPath.split('?')[0]]
  const [isTabUrlLoaded, setIsTabUrlLoaded] = useState(
    typeof currentTabId === 'number'
  )
  const [selectedTab, setSelectedTab] = useState(currentTabId ?? 1)

  useEffect(() => {
    if (!router.isReady) return

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
  }, [router])

  const usedSelectedTab = isTabUrlLoaded ? selectedTab : -1
  const usedSetSelectedTab = (selectedTab: number) => {
    setSelectedTab(selectedTab)
    const selectedTabId = tabs[selectedTab]?.id
    if (selectedTabId)
      router.push(`/${selectedTabId}`, undefined, { shallow: true })
  }

  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)

  return (
    <DefaultLayout
      navbarProps={{
        customContent: ({ logoLink, authComponent, notificationBell }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-1'>
                    {searchButton}
                    {notificationBell}
                    <div className='ml-2'>{authComponent}</div>
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
      <SearchChannelsWrapper
        search={search}
        getFocusedElementIndex={getFocusedElementIndex}
      >
        <Tabs
          className='border-b border-border-gray bg-background-light px-0 md:bg-background-light/50'
          panelClassName='mt-0 px-0'
          asContainer
          tabs={tabs}
          withHashIntegration={false}
          tabsRightElement={
            isLoggedIn &&
            COMMUNITY_CHAT_HUB_ID && (
              <div className='ml-4 mr-2 flex flex-1 items-center justify-end self-stretch'>
                <Button
                  size='sm'
                  variant='primary'
                  className='flex items-center gap-2'
                  onClick={() => {
                    setIsOpenNewCommunity(true)
                    sendEvent('click new_community_button in home_page')
                  }}
                >
                  <CommunityAddIcon className='text-text-muted-on-primary' />
                  <span>New</span>
                </Button>
              </div>
            )
          }
          hideBeforeHashLoaded
          manualTabControl={{
            selectedTab: usedSelectedTab,
            setSelectedTab: usedSetSelectedTab,
          }}
        />
      </SearchChannelsWrapper>

      {COMMUNITY_CHAT_HUB_ID && (
        <NewCommunityModal
          isOpen={isOpenNewCommunity}
          closeModal={() => setIsOpenNewCommunity(false)}
          hubId={COMMUNITY_CHAT_HUB_ID}
        />
      )}
    </DefaultLayout>
  )
}
