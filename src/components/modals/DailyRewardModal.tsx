import Diamond from '@/assets/emojis/diamond.png'
import { getServerDayQuery } from '@/services/api/query'
import { getDailyRewardQuery } from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import Button from '../Button'

export default function DailyRewardModal({
  close,
  isOpen,
}: {
  isOpen: boolean
  close: () => void
}) {
  const sendEvent = useSendEvent()
  const myAddress = useMyMainAddress()
  const { data } = getDailyRewardQuery.useQuery(myAddress ?? '')
  const { data: serverDay } = getServerDayQuery.useQuery(null)

  return createPortal(
    <>
      <Transition
        show={isOpen}
        appear
        className='fixed inset-0 z-40 h-full w-full bg-black/50 backdrop-blur-md transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
        onClick={close}
      />
      <Transition
        show={isOpen}
        appear
        className='fixed bottom-0 left-1/2 z-40 mx-auto flex h-auto w-full max-w-screen-md -translate-x-1/2 rounded-t-[10px] bg-background-light outline-none transition duration-300'
        enterFrom={cx('opacity-0 translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 translate-y-24 !duration-150'
      >
        <div className='mx-auto flex w-full max-w-screen-md flex-col gap-6 overflow-auto px-5 py-6 pb-12'>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-medium'>Your daily rewards</span>
            <span className='text-text-muted'>
              Claim rewards and keep the streak going!
            </span>
          </div>
          <div className='grid w-full grid-cols-4 gap-4 gap-x-2 gap-y-6'>
            {data?.claims.map((claim) => {
              const isClaimed =
                claim.claimValidDay &&
                Number(claim.claimValidDay) < (serverDay?.day ?? 0)
              const isClaimable =
                Number(claim.claimValidDay) === serverDay?.day &&
                claim.openToClaim
              return (
                <div
                  key={claim.index}
                  className={cx(
                    'flex flex-col overflow-clip rounded-2xl border border-background-lighter bg-background-light',
                    isClaimable &&
                      'border-background-primary bg-background-lighter',
                    isClaimed &&
                      'border-background-primary bg-background-primary/30'
                  )}
                >
                  <div className='flex flex-col items-center justify-center gap-1 px-4 py-3'>
                    <Image src={Diamond} alt='' className='h-8 w-8' />
                    <span className='text-xl font-bold'>
                      {formatNumber(claim.claimRewardPoints, { shorten: true })}
                    </span>
                  </div>
                  <div
                    className={cx(
                      'bg-background-lighter pb-1 pt-0.5 text-center',
                      isClaimable && 'bg-background-primary',
                      isClaimed && 'bg-transparent'
                    )}
                  >
                    <span className='text-sm'>Day {claim.index + 1}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className='grid w-full grid-cols-1 gap-4'>
            <Button
              size='lg'
              onClick={() => {
                sendEvent('daily_reward_claimed')
                // TODO: Claim reward
              }}
            >
              Claim
            </Button>
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}
