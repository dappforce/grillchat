import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { cx } from '@/utils/class-names'
import { getUrlQuery } from '@/utils/links'
import { SDKProvider } from '@tma.js/sdk-react'
import { useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import LeaderboardAccountContent from './epic-leaderboard/AccountContent'
import MainContent from './epic-leaderboard/MainContent'

export default function HomePage() {
  const isMounted = useIsMounted()
  return (
    <SDKProvider>
      <DefaultLayout className='relative' style={{ minHeight: '100dvh' }}>
        {isMounted && <HomePageContent />}
      </DefaultLayout>
    </SDKProvider>
  )
}

const hubId = env.NEXT_PUBLIC_MAIN_SPACE_ID
const chatId = env.NEXT_PUBLIC_MAIN_CHAT_ID

function HomePageContent() {
  const [homePageView, setHomePageView] = useState<HomePageView>(() => {
    const tab = getUrlQuery('tab')
    if (tab === 'top-memes' || tab === 'stats' || tab === 'account') {
      return tab
    }
    return 'stats'
  })

  return (
    <>
      <Container className='grid flex-1 items-start gap-4 px-0 lg:grid-cols-[1fr_472px] lg:pr-3'>
        <ChatContent
          hubId={hubId}
          chatId={chatId}
          className={cx(
            cx('lg:flex', { ['hidden']: homePageView !== 'top-memes' })
          )}
        />
        <MainContent
          className={cx('lg:flex', { ['hidden']: homePageView !== 'stats' })}
        />
        <div
          className={cx('lg:hidden', {
            ['hidden']: homePageView !== 'account',
          })}
        >
          <LeaderboardAccountContent />
        </div>
      </Container>
      <MobileNavigation
        setHomePageView={setHomePageView}
        homePageView={homePageView}
      />
    </>
  )
}
