import CommunityAddIcon from '@/assets/icons/community-add.svg'
import Button from '@/components/Button'
import Tabs, { TabsProps } from '@/components/Tabs'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import { getOwnedPostsQuery } from '@/services/datahub/posts/query'
import { useUpsertSpace } from '@/services/datahub/spaces/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useLocation } from '@/stores/location'
import {
  accountAddressStorage,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { replaceUrl } from '@/utils/window'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import urlJoin from 'url-join'
import HotChatsContent from './HotChatsContent'
import MyChatsContent from './MyChatsContent'

export type HomePageProps = {
  hubsChatCount: { [id: string]: number }
}

const hotChatsHubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const communityHubId = env.NEXT_PUBLIC_COMMUNITY_HUB_ID

export const homePageAdditionalTabs: {
  id: string
  text: string
  hubId: string
}[] = [
  // Example additional tabs
  // {
  //   id: 'ai-bots',
  //   text: 'AI Experts',
  //   hubId: '1031',
  // },
]

const pathnameTabIdMapper: Record<string, number> = {
  '/my-chats': 0,
  '/hot-chats': 1,
  // '/ai-bots': 2,
  '/hubs': 2,
}

const hasOwnedPostsStorage = new LocalStorage(
  (address: string) => `hasOwnedPosts-${address}`
)
const addressFromStorage = accountAddressStorage.get()

export default function HomePage(props: HomePageProps) {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const router = useRouter()
  const sendEvent = useSendEvent()
  const isFirstAccessed = useLocation((state) => state.isFirstAccessed)

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
  const usedAddress = myAddress || addressFromStorage || ''
  const { data: ownedPosts, isLoading } = getOwnedPostsQuery.useQuery(
    myAddress || addressFromStorage || ''
  )

  useEffect(() => {
    if (isLoading) return
    if (ownedPosts?.length) {
      hasOwnedPostsStorage.set('true', usedAddress)
    } else {
      hasOwnedPostsStorage.remove(usedAddress)
    }
  }, [ownedPosts, isLoading, usedAddress])

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
      if (hasOwnedPostsStorage.get(usedAddress)) {
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

  const [isOpenNewCommunity, setIsOpenNewCommunity] = useState(false)
  const address = useMyAccount((state) => state.address)
  const { mutate } = useUpsertSpace()

  return (
    <DefaultLayout withSidebar>
      <Button
        onClick={() =>
          mutate({ content: { name: 'Test space', about: 'test space' } })
        }
      >
        LOGIN
      </Button>
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
              <Button
                size='xs'
                variant='primary'
                className='flex items-center gap-2'
                onClick={() => {
                  setIsOpenNewCommunity(true)
                  sendEvent('open_community_creation_modal', {
                    eventSource: 'home',
                  })
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

      {communityHubId && (
        <NewCommunityModal
          isOpen={isOpenNewCommunity}
          closeModal={() => setIsOpenNewCommunity(false)}
          hubId={communityHubId}
        />
      )}
    </DefaultLayout>
  )
}
