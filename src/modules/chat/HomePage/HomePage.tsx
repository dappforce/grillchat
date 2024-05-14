import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import MainContent from './epic-leaderboard/MainContent'

const hubId = '0xc75507f88e6a7d555c15ac95c49cb426'
const chatId = '0x3b1bf91da3fd7e5d790c19039110a5a7'

export type HomePageProps = {}

export default function HomePage() {
  const [homePageView, setHomePageView] = useState<HomePageView>('stats')

  return (
    <DefaultLayout className='relative'>
      <Container className='grid flex-1 gap-4 px-0 lg:grid-cols-[1fr_472px] lg:px-4 '>
        <ChatContent
          hubId={hubId}
          chatId={chatId}
          className={cx({ ['hidden lg:flex']: homePageView === 'stats' })}
        />
        <MainContent
          className={cx({ ['hidden lg:flex']: homePageView === 'top-memes' })}
        />
      </Container>
      <MobileNavigation
        setHomePageView={setHomePageView}
        homePageView={homePageView}
      />
    </DefaultLayout>
  )
}
