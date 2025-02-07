import Tabs, { TabsProps } from '@/components/Tabs'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useSearch from '@/hooks/useSearch'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { useLocation } from '@/stores/location'
import {
  accountAddressStorage,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { replaceUrl } from '@/utils/window'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import urlJoin from 'url-join'
import SearchChannelsWrapper from '../SearchChannelsWrapper'
import CreateChatButton from './CreateChatButton'
import HotChatsContent from './HotChatsContent'
import MyChatsContent from './MyChatsContent'

export type HomePageProps = {
  hubsChatCount: { [id: string]: number }
}

const hotChatsHubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
export const communityHubId = env.NEXT_PUBLIC_COMMUNITY_HUB_ID

const addressFromStorage = accountAddressStorage.get()

export const homePageAdditionalTabs: {
  id: string
  text: string
  hubId: string
}[] = []

const pathnameTabIdMapper: Record<string, number> = {
  '/my-chats': 0,
  '/hot-chats': 1,
  '/hubs': 2,
}

export default function HomePage(props: HomePageProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const router = useRouter()
  const sendEvent = useSendEvent()
  const isFirstAccessed = useLocation((state) => state.isFirstAccessed)
  const { search, setSearch, getFocusedElementIndex, focusController } =
    useSearch()

  const refSearchParam = useReferralSearchParam()

  const tabs: TabsProps['tabs'] = [
    {
      id: 'my-chats',
      text: 'My Chats',
      content: (setSelectedTab) => (
        <MyChatsContent changeTab={setSelectedTab} />
      ),
    },
    {
      id: 'hot-chats',
      text: 'Recommended',
      content: () => <HotChatsContent hubId={hotChatsHubId} />,
    },
    ...homePageAdditionalTabs.map(({ id, text, hubId }) => ({
      id,
      text,
      content: () => <HotChatsContent hubId={hubId} />,
    })),
    // {
    //   id: 'hubs',
    //   text: 'Hubs',
    //   content: () => <HubsContent hubsChatCount={props.hubsChatCount} />,
    // },
  ]

  const myAddress = useMyMainAddress()
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

    const currentPathname = window.location.pathname
      .replace(new RegExp(`^${env.NEXT_PUBLIC_BASE_PATH}`), '')
      .substring(1)
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
      router.push(urlJoin(`/${selectedTabId}`, refSearchParam), undefined, {
        shallow: true,
      })
  }

  return (
    <DefaultLayout
      withSidebar={false}
      navbarProps={{
        customContent: ({
          logoLink,
          authComponent,
          notificationBell,
          newPostButton,
        }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-0'>
                    {newPostButton}
                    {searchButton}
                    {notificationBell}
                    <div className='ml-2.5'>{authComponent}</div>
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
      <div className='flex flex-1 flex-col lg:pr-3'>
        <SearchChannelsWrapper
          search={search}
          getFocusedElementIndex={getFocusedElementIndex}
        >
          <Tabs
            className='border-b border-border-gray bg-background-light px-0.5 text-sm md:bg-background-light/50'
            panelClassName='mt-0 px-0'
            tabClassName={cx('px-1.5 sm:px-2')}
            asContainer
            tabs={tabs}
            withHashIntegration={false}
            tabsRightElement={
              isLoggedIn &&
              communityHubId && (
                <div className='ml-auto mr-2 flex items-center justify-end self-stretch pl-2'>
                  <CreateChatButton />
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
      </div>
    </DefaultLayout>
  )
}
