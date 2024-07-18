import Diamond from '@/assets/emojis/diamond.png'
import TapFromMobileImage from '@/assets/graphics/tap-from-mobile.png'
import SkeletonFallback from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import Points from '@/modules/points/PointsPreview'
import PointsWidget from '@/modules/points/PointsWidget'
import {
  FULL_ENERGY_VALUE,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import Image from 'next/image'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget
        isNoTgScroll
        withPointsAnimation={false}
        className='sticky top-0'
      />
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
    <div
      id='tap-page-container'
      className='relative grid flex-1 grid-rows-[2fr,0.2fr] items-center justify-items-center'
    >
      <div className='relative w-full'>
        <PointsPreview />
        <PointsClicker className='h-full justify-self-center' />
      </div>
      <EnergyState />
    </div>
  )
}

const PointsPreview = () => {
  return (
    <div className='absolute left-0 right-0 top-8 mx-auto flex w-fit items-center gap-2'>
      <Image className='h-[67px] w-[67px]' src={Diamond} alt='' />
      <span className='text-[40px] font-bold'>
        <Points withPointsAnimation={false} />
      </span>
    </div>
  )
}

const EnergyState = () => {
  const myAddress = useMyMainAddress()

  const { data, isLoading } = getEnergyStateQuery.useQuery(myAddress || '')

  const { energyValue } = data || {}

  return (
    <span className='mt-[-90px] flex h-full items-start gap-1 text-base font-bold leading-[22px]'>
      🔋{' '}
      <SkeletonFallback
        className='inline-block w-fit min-w-10'
        isLoading={isLoading}
      >
        {energyValue}
      </SkeletonFallback>{' '}
      <span>/</span> {FULL_ENERGY_VALUE}
    </span>
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
