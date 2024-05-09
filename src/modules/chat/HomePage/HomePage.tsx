import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import MainContent from './epic-leaderboard/MainContent'

export type HomePageProps = {}

export default function HomePage() {
  const [homePageView, setHomePageView] = useState<HomePageView>('stats')

  const chat = (
    <ChatContent
      hubId='0xc75507f88e6a7d555c15ac95c49cb426'
      chatId='0x3b1bf91da3fd7e5d790c19039110a5a7'
    />
  )

  return (
    <DefaultLayout className='relative'>
      {/* <EpicTokenIllust
        key={'epic-token-illust'}
        id='epic-token-illust'
        className={cx(
          ''
        )}
      /> */}
      <Container className='hidden flex-1 gap-4 px-4 lg:grid lg:grid-cols-[1fr_325px] xl:grid-cols-[1fr_400px]'>
        {chat}
        <MainContent key='desktop' />
      </Container>
      <div className='block flex-[1_1_0] px-4 lg:hidden '>
        {homePageView === 'top-memes' ? chat : <MainContent key='mobile' />}
      </div>
      <MobileNavigation
        setHomePageView={setHomePageView}
        homePageView={homePageView}
      />
    </DefaultLayout>
  )
}
