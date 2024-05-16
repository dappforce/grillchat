import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ChatContent from './ChatContent'
import MobileNavigation, { HomePageView } from './MobileNavigation'
import MainContent from './epic-leaderboard/MainContent'

const hubId = '0xc75507f88e6a7d555c15ac95c49cb426'
const chatId = '0x3b1bf91da3fd7e5d790c19039110a5a7'

export type HomePageProps = {
  address?: string
}

export default function HomePage({ address }: HomePageProps) {
  const [homePageView, setHomePageView] = useState<HomePageView>('stats')
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress()
  const router = useRouter()

  useEffect(() => {
    if (isInitializedProxy && myAddress && !address) {
      router.replace('/[address]', `/${myAddress}`, { shallow: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, myAddress, isInitializedProxy])

  return (
    <DefaultLayout className='relative'>
      <Container className='grid flex-1 gap-4 px-0 lg:grid-cols-[1fr_472px] lg:pr-3'>
        <ChatContent
          hubId={hubId}
          chatId={chatId}
          className={cx({ ['hidden lg:flex']: homePageView === 'stats' })}
        />
        <MainContent
          className={cx({ ['hidden lg:flex']: homePageView === 'top-memes' })}
          address={address}
        />
      </Container>
      <MobileNavigation
        setHomePageView={setHomePageView}
        homePageView={homePageView}
      />
    </DefaultLayout>
  )
}
