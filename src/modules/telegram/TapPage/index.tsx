import TapFromMobileImage from '@/assets/graphics/tap-from-mobile.png'
import SkeletonFallback from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import ProgressModal from '@/components/modals/RewardPerDayModal'
import WelcomeModal from '@/components/modals/WelcomeModal'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { increaseEnergyValue } from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { useQueryClient } from '@tanstack/react-query'
import { useMiniAppRaw } from '@tma.js/sdk-react'
import Image from 'next/image'
import { useEffect } from 'react'
import PointsClicker from './PointsClicker'

const TapPage = () => {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation
      className='relative'
      style={{ minHeight: '100dvh' }}
    >
      <PointsWidget isNoTgScroll className='sticky top-0' />
      <TapPageContent />
      <WelcomeModal />
      <ProgressModal />
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
    <div className='flex flex-1 flex-col items-center justify-center gap-14'>
      <PointsClicker className='justify-self-center' />
      <EnergyState />
    </div>
  )
}

const EnergyState = () => {
  const myAddress = useMyMainAddress()
  const client = useQueryClient()

  const { data, isLoading } = getEnergyStateQuery.useQuery(myAddress || '')

  const { energyValue } = data || {}

  useEffect(() => {
    const interval = setInterval(() => {
      if (energyValue === FULL_ENERGY_VALUE) return
      increaseEnergyValue({
        client,
        address: myAddress || '',
        energyValuePerClick: 1,
      })
    }, 2000)

    return () => clearInterval(interval)
  })

  return (
    <span className='text-base font-bold leading-[22px]'>
      🔋{' '}
      <SkeletonFallback
        className='relative -top-0.5 inline-block w-16 align-middle'
        isLoading={isLoading}
      >
        {energyValue}
      </SkeletonFallback>{' '}
      /{FULL_ENERGY_VALUE}
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
