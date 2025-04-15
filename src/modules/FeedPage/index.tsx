import NoData from '@/components/NoData'
import Tabs, { TabsProps } from '@/components/Tabs'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useSearch from '@/hooks/useSearch'
import { getFollowedPostIdsByAddressQuery } from '@/services/subsocial/posts'
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
import SpacesTab from './SpacesTab'

export type FeedPageProps = {
  hubsChatCount: { [id: string]: number }
}

const addressFromStorage = accountAddressStorage.get()

export const homePageAdditionalTabs: {
  id: string
  text: string
  hubId: string
}[] = []

const pathnameTabIdMapper: Record<string, number> = {
  '/my-feed': 0,
  '/posts': 1,
  '/spaces': 2,
}

export default function FeedPage(props: FeedPageProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const router = useRouter()
  const isFirstAccessed = useLocation((state) => state.isFirstAccessed)
  const { search, setSearch, focusController } = useSearch()

  const refSearchParam = useReferralSearchParam()

  const tabs: TabsProps['tabs'] = [
    {
      id: 'my-feed',
      text: 'My Feed',
      content: (setSelectedTab) => <NoData message='No posts yet' />,
    },
    {
      id: 'posts',
      text: 'Posts',
      content: (setSelectedTab) => <NoData message='No posts yet' />,
    },
    {
      id: 'spaces',
      text: 'Spaces',
      content: (setSelectedTab) => <SpacesTab />,
    },
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
    // const selectedTabId = tabs[selectedTab]?.id
    // if (selectedTabId)
    //   router.push(urlJoin(`/${selectedTabId}`, refSearchParam), undefined, {
    //     shallow: true,
    //   })
  }

  return (
    <DefaultLayout
      withSidebar
      withRightSidebar={false}
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
        <Tabs
          className='max-w-full border-b border-border-gray bg-background-light px-0.5 text-sm md:bg-background-light/50'
          panelClassName='mt-0 px-0 px-2 py-4'
          tabClassName={cx('px-1.5 sm:px-2')}
          tabs={tabs}
          withHashIntegration={false}
          hideBeforeHashLoaded
          manualTabControl={{
            selectedTab: usedSelectedTab,
            setSelectedTab: usedSetSelectedTab,
          }}
        />
      </div>
    </DefaultLayout>
  )
}
