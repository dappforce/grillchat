import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { env } from '@/env.mjs'
import useIsMounted from '@/hooks/useIsMounted'
import { cx } from '@/utils/class-names'
import { SDKProvider } from '@tma.js/sdk-react'
import MobileNavigation from '../../../components/layouts/MobileNavigation'
import ChatContent from './ChatContent'
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
  return (
    <>
      <Container className='grid flex-1 items-start gap-4 px-0 lg:grid-cols-[1fr_472px] lg:pr-3'>
        <ChatContent hubId={hubId} chatId={chatId} />
        <MainContent />
        <div className={cx('lg:hidden')}>
          <LeaderboardAccountContent />
        </div>
      </Container>
      <MobileNavigation />
    </>
  )
}
