import TapFromMobileImage from '@/assets/graphics/tap-from-mobile.png'
import Button from '@/components/Button'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import PointsWidget from '@/modules/points/PointsWidget'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import Image from 'next/image'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget className='sticky top-0' />
      <TapPageContent />
    </LayoutWithBottomNavigation>
  )
}

const TapPageContent = () => {
  const app = useMiniAppRaw(true)
  const isMobile = isTouchDevice()

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

        <Button variant='primary' size={'md'} className='w-fit'>
          Try Meme to Earn
        </Button>
      </div>
    </div>
  )
}

const MobileDeviceForBetterExp = () => {
  return (
    <div className='relative flex flex-1 items-end justify-center overflow-hidden'>
      <span className='z-[2] text-center text-xl font-bold'>
        Use a mobile device for better experience
      </span>
      <Image src={TapFromMobileImage} alt='' className='absolute top-0' />
    </div>
  )
}

export default TapPage
