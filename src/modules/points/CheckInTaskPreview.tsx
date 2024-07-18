import CalendarImage from '@/assets/graphics/tasks/calendar.png'
import { RedDot } from '@/components/layouts/MobileNavigation'
import DailyRewardModal from '@/components/modals/DailyRewardModal'
import SkeletonFallback from '@/components/SkeletonFallback'
import { getServerDayQuery } from '@/services/api/query'
import { getDailyRewardQuery } from '@/services/datahub/content-staking/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { useState } from 'react'

const CheckInTaskPreview = () => {
  const myAddress = useMyMainAddress()
  const [isOpen, setIsOpen] = useState(false)

  const { data: serverDay, isLoading: loadingServerDay } =
    getServerDayQuery.useQuery(null)
  const { data: dailyReward, isLoading: loadingDailyReward } =
    getDailyRewardQuery.useQuery(myAddress ?? '')
  const todayRewardIndex = dailyReward?.claims.findIndex(
    (claim) => Number(claim.claimValidDay) === serverDay?.day
  )

  const todayReward = dailyReward?.claims[todayRewardIndex || 0]
  const isTodayRewardClaimed = !!todayReward && !todayReward.openToClaim

  return (
    <>
      <DailyRewardModal isOpen={isOpen} close={() => setIsOpen(false)} />
      <div
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
      >
        <div className='flex items-center gap-2'>
          <span className='relative'>
            <Image src={CalendarImage} alt='' className='h-8 w-8' />
            {!isTodayRewardClaimed && (
              <RedDot className='!bottom-0 !right-0 -translate-x-0.5 translate-y-[22px]' />
            )}
          </span>
          <span
            className={cx(
              'flex items-center text-xl font-bold leading-[22px]',
              {
                ['text-slate-500']: !isTodayRewardClaimed,
              }
            )}
          >
            <SkeletonFallback
              isLoading={loadingServerDay || loadingDailyReward}
              className='w-fit min-w-[30px]'
            >
              {(todayRewardIndex || 0) + 1}
            </SkeletonFallback>
            /7
          </span>
        </div>
      </div>
    </>
  )
}

export default CheckInTaskPreview
