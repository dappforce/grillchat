import TapFromMobileImage from '@/assets/graphics/tap-from-mobile.png'
import Button from '@/components/Button'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import WelcomeModal from '@/components/modals/WelcomeModal'
import PointsWidget from '@/modules/points/PointsWidget'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget className='sticky top-0' />
      <TapPageContent />
      <WelcomeModal />
    </LayoutWithBottomNavigation>
  )
}

const TapPageContent = () => {
  const app = useMiniAppRaw(true)
  const isMobile = isTouchDevice()
  const router = useRouter()

  if (app?.result && !isMobile) {
    return <MobileDeviceForBetterExp />
  }

  return (
    <div className='grid flex-1 grid-rows-[70%,30%] items-center'>
      <PointsClicker className='justify-self-center' />
      <div className='flex flex-col items-center gap-[22px] px-4'>
        <span className={cx('text-center', mutedTextColorStyles)}>
          Tap2Earn is coming soon! While you wait, start earning points today by
          creating and liking memes.
        </span>

        <Button
          variant='primary'
          size={'md'}
          className='w-fit'
          onClick={() => router.replace('/tg/memes')}
        >
          Try Meme to Earn
        </Button>
      </div>
    </div>
  )
}

const MobileDeviceForBetterExp = () => {
  return (
    <div className='relative flex flex-1 justify-center'>
      <span className='absolute bottom-[15%] z-[2] text-center text-xl font-bold'>
        Use a mobile device for better experience
      </span>
      <div
        style={{ transform: 'translate3d(0, 0, 0)' }}
        className='absolute top-[-100px] my-auto h-[175px] w-[175px] bg-[#5E81EA] blur-[102px]'
      ></div>
      <Image
        src={TapFromMobileImage}
        alt=''
        className='absolute top-0 h-full w-auto'
      />
    </div>
  )
}

export default TapPage
