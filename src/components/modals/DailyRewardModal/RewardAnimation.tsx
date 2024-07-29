import PresentAnimation from '@/assets/animations/present.json'
import Diamond from '@/assets/emojis/diamond.png'
import { GetDailyRewardQuery } from '@/services/datahub/generated-query'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Lottie, { LottieProps } from 'react-lottie'

export type DailyRewardClaim = NonNullable<
  GetDailyRewardQuery['gamificationEntranceDailyRewardSequence']
>['claims'][number]

export type RewardAnimationProps = Omit<LottieProps, 'options'> & {
  claim: DailyRewardClaim
  close: () => void
}

export default function RewardAnimation({
  claim,
  close,
  ...props
}: RewardAnimationProps) {
  const isMysteryBox = !!claim.hiddenClaimReward

  const [showPointsEarned, setShowPointsEarned] = useState(!isMysteryBox)
  const defaultOptions: LottieProps = {
    ...props,
    options: {
      loop: false,
      autoplay: true,
      animationData: PresentAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
  }
  useEffect(() => {
    setTimeout(() => {
      setShowPointsEarned(true)
    }, 800)
  }, [])

  return (
    <>
      {!showPointsEarned && (
        <Transition
          appear
          show
          className='fixed inset-0 z-40 flex h-full w-full max-w-screen-md origin-center flex-col items-center justify-center gap-2 transition duration-300'
          enterFrom={cx('opacity-0 scale-75')}
          enterTo={cx('opacity-100 scale-100')}
          leaveFrom={cx('opacity-100 scale-100')}
          leaveTo={cx('opacity-0 scale-75')}
        >
          <div className='absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-background-primary/20 blur-3xl' />
          <Lottie
            {...defaultOptions}
            isPaused={false}
            height={props.height || 250}
            width={props.width || 250}
          />
        </Transition>
      )}
      {showPointsEarned && (
        <Transition
          appear
          show
          className='fixed inset-0 z-40 flex h-full w-full max-w-screen-md origin-center items-center justify-center transition duration-300'
          enterFrom={cx('opacity-0 scale-75')}
          enterTo={cx('opacity-100 scale-100')}
          leaveFrom={cx('opacity-100 scale-100')}
          leaveTo={cx('opacity-0 scale-75')}
          onClick={() => close()}
        >
          <div className='absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-background-primary/20 blur-3xl' />
          <div className='relative flex flex-1 flex-col items-center justify-center gap-1 px-4 py-3'>
            <Image src={Diamond} alt='' className='h-12 w-12' />
            <span className='text-3xl font-bold'>
              {formatNumber(claim.claimRewardPoints)}
            </span>
            <span className='text-text/70'>Points earned!</span>
            <span className='mt-8 text-text/50'>Tap anywhere to close</span>
          </div>
        </Transition>
      )}
    </>
  )
}
