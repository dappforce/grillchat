import FriendsAnimals from '@/assets/graphics/friends/friends-animals.png'
import BlueGradient from '@/assets/graphics/landing/gradients/blue.png'
import Button from '@/components/Button'
import Card from '@/components/Card'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import { getReferralLink } from '@/components/referral/utils'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { getUserReferralStatsQuery } from '@/services/datahub/leaderboard/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { copyToClipboard, formatNumber } from '@/utils/strings'
import { initUtils } from '@tma.js/sdk-react'
import Image from 'next/image'
import { useState } from 'react'
import { MdCheck, MdOutlineContentCopy } from 'react-icons/md'
import SkeletonFallback from '../../../components/SkeletonFallback'
import ReferralTable from './ReferralTable'
import ReferrerStats from './ReferrerStats'

export default function FriendsPage() {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <PointsWidget isNoTgScroll className='sticky top-0' />
      <Image
        src={BlueGradient}
        priority
        alt=''
        className='absolute -top-[180px] left-1/2 z-0 w-full -translate-x-1/2'
      />
      <FriendsPageContent />
    </LayoutWithBottomNavigation>
  )
}

const FriendsPageContent = () => {
  const [isCopied, setIsCopied] = useState(false)
  const myAddress = useMyMainAddress()
  const referralLink = getReferralLink(myAddress)
  const sendEvent = useSendEvent()

  const { data, isLoading } = getUserReferralStatsQuery.useQuery(
    myAddress || ''
  )

  const { refCount, pointsEarned, referrals } = data || {}

  const onCopyClick = (text: string) => {
    sendEvent('ref_copied')
    copyToClipboard(text)

    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  return (
    <div className='relative flex flex-col gap-6 overflow-auto px-4 pt-6'>
      <div className='flex flex-col items-center gap-4'>
        <Image src={FriendsAnimals} alt='' className='h-[100px] w-[190px]' />

        <div className='flex flex-col items-center gap-2'>
          <span className='text-center text-[28px] font-extrabold leading-[150%] text-[#D9D9D9]'>
            INVITE TO GET BONUS
          </span>
          <span className='text-center leading-[22px] text-slate-400'>
            You receive <span className='font-bold text-[#FF9331]'>10%</span> of
            the points your first-line friends earn, and{' '}
            <span className='font-bold text-[#FF9331]'>1%</span> from their
            friends’ earnings.
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <ReferrerStats
          refCount={refCount ?? 0}
          pointsEarned={pointsEarned ?? '0'}
          isLoading={isLoading}
        />
        <EarnInfoSection />
        <ReferralTable
          referrals={referrals}
          isLoading={isLoading}
          refCount={refCount ?? 0}
        />
      </div>
      <div
        className='sticky bottom-0 z-10 flex items-center gap-2 pb-2 pt-4'
        style={{
          background:
            'linear-gradient(180deg, rgba(17, 23, 41, 0.00) 0%, #111729 100%)',
        }}
      >
        <Button
          className='w-full'
          size={'lg'}
          variant='primary'
          onClick={() => {
            if (isTouchDevice()) {
              navigator
                .share({
                  url: referralLink,
                })
                .catch((error) => {
                  console.error('Error sharing:', error)
                })
            } else {
              const utils = initUtils()

              try {
                utils.openTelegramLink(`
                  https://t.me/share/url?url=${referralLink}`)
              } catch (e) {
                console.error('Error opening telegram:')
              }
            }
          }}
        >
          Invite frens
        </Button>
        <Button
          size='lg'
          variant={'bgLighter'}
          className='flex h-[48px] min-w-[48px] items-center justify-center bg-slate-700 p-0 text-white'
          onClick={() => onCopyClick(referralLink)}
        >
          {isCopied ? <MdCheck /> : <MdOutlineContentCopy />}
        </Button>
      </div>
    </div>
  )
}

type ReferralCardsProps = {
  refCount: number
  pointsEarned: string
  isLoading?: boolean
}

const ReferralCards = ({
  refCount,
  pointsEarned,
  isLoading,
}: ReferralCardsProps) => {
  return (
    <div className='flex items-center gap-4'>
      <Card className='flex flex-col gap-2 bg-background-light px-4'>
        <SkeletonFallback isLoading={isLoading} className='w-8'>
          <span className='text-2xl font-bold'>{formatNumber(refCount)}</span>
        </SkeletonFallback>
        <span className='text-sm font-medium text-slate-400'>
          Points earned from your friends activity
        </span>
      </Card>
      <Card className='flex flex-col gap-2 bg-background-light px-4'>
        <SkeletonFallback isLoading={isLoading} className='w-8'>
          <span className='text-2xl font-bold'>
            {formatNumber(pointsEarned)}
          </span>
        </SkeletonFallback>
        <span className='text-sm font-medium text-slate-400'>
          Points earned from {formatNumber(refCount)} invited friends
        </span>
      </Card>
    </div>
  )
}

const EarnInfoSection = () => {
  return (
    <Card className='flex flex-col gap-4 bg-background-light px-4'>
      <div className='flex flex-col gap-2'>
        <span className='text-lg font-semibold leading-[150%]'>
          <span className='font-extrabold text-text-primary'>💎 +200,000</span>{' '}
          when your friend joined
        </span>
        <span className='text-slate-400'>
          You’ll get 200,000 points for every invite. Complete tasks to earn
          even more.
        </span>
      </div>
      <Button href='/tg/tasks' variant={'primaryOutline'}>
        Go to tasks
      </Button>
    </Card>
  )
}
