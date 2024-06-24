import Diamond from '@/assets/emojis/diamond.png'
import Calendar from '@/assets/graphics/tasks/calendar.png'
import Like from '@/assets/graphics/tasks/like.png'
import Telegram from '@/assets/graphics/tasks/telegram.png'
import TwitterX from '@/assets/graphics/tasks/twitter-x.png'
import Check from '@/assets/icons/check.svg'
import Card from '@/components/Card'
import SkeletonFallback from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import DailyRewardModal from '@/components/modals/DailyRewardModal'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { getServerDayQuery } from '@/services/api/query'
import {
  getDailyRewardQuery,
  getTodaySuperLikeCountQuery,
  getTokenomicsMetadataQuery,
} from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { formatNumber } from '@/utils/strings'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa6'

export default function TasksPage() {
  useTgNoScroll()

  return (
    <LayoutWithBottomNavigation className='relative' withFixedHeight>
      <PointsWidget
        isNoTgScroll
        withPointsAnimation={false}
        className='sticky top-0'
      />
      <div className='flex flex-1 flex-col gap-8 overflow-auto px-4 py-8'>
        <DailyTasks />
        <BasicTasks />
        <NewTasks />
      </div>
    </LayoutWithBottomNavigation>
  )
}

function DailyTasks() {
  const sendEvent = useSendEvent()
  const [isOpen, setIsOpen] = useState(false)
  const myAddress = useMyMainAddress() ?? ''
  const { data: superLikeCount, isLoading } =
    getTodaySuperLikeCountQuery.useQuery(myAddress)

  const { data: tokenomics } = getTokenomicsMetadataQuery.useQuery(null)
  const pointsPerSuperLike = tokenomics
    ? (tokenomics.likerRewardDistributionPercent / 100) *
      Number(tokenomics.superLikeWeightPoints)
    : 4000

  const { data: serverDay } = getServerDayQuery.useQuery(null)
  const { data: dailyReward } = getDailyRewardQuery.useQuery(myAddress ?? '')
  const todayReward = dailyReward?.claims.find(
    (claim) => Number(claim.claimValidDay) === serverDay?.day
  )
  const isTodayRewardClaimed = !todayReward?.openToClaim

  let todayRewardPoints: string | number = Number(
    todayReward?.claimRewardPoints ?? 0
  )
  if (
    todayReward?.claimRewardPointsRange &&
    todayReward?.claimRewardPointsRange?.length > 0
  ) {
    todayRewardPoints = `${formatNumber(
      todayReward.claimRewardPointsRange[0]
    )} - ${formatNumber(todayReward.claimRewardPointsRange[1])}`
  }

  return (
    <>
      <DailyRewardModal isOpen={isOpen} close={() => setIsOpen(false)} />
      <div className='flex flex-col gap-5'>
        <span className='self-center text-lg font-bold text-text-muted'>
          Daily
        </span>
        <div className='flex flex-col gap-2'>
          <TaskCard
            onClick={() => {
              sendEvent('tasks_daily_reward_open')
              setIsOpen(true)
            }}
            image={Calendar}
            title='Check in'
            reward={todayRewardPoints}
            completed={isTodayRewardClaimed}
          />
          <TaskCard
            image={Like}
            onClick={() => {
              sendEvent('tasks_like_open')
            }}
            title='Like 10 memes'
            href='/tg/memes'
            reward={pointsPerSuperLike * 10}
            completed={false}
            customAction={
              <span className='font-bold'>
                <SkeletonFallback
                  isLoading={isLoading}
                  className='relative -top-0.5 inline-block w-6 align-middle'
                >
                  {10 - (superLikeCount?.count ?? 0)}
                </SkeletonFallback>
                /10
              </span>
            }
          />
        </div>
      </div>
    </>
  )
}

function BasicTasks() {
  const sendEvent = useSendEvent()
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-1'>
        <span className='self-center text-lg font-bold text-text-muted'>
          Basic Tasks
        </span>
        <span className='self-center text-center text-sm text-text-muted'>
          Join our social media and receive rewards later
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        <TaskCard
          image={Telegram}
          onClick={() => {
            sendEvent('tasks_telegram_open')
          }}
          title='Join Our Telegram Channel'
          href='https://t.me/EpicAppNet'
          openInNewTab
          reward={30000}
          completed={false}
        />
        <TaskCard
          image={TwitterX}
          onClick={() => {
            sendEvent('tasks_x_open')
          }}
          href='https://x.com/EpicAppNet'
          openInNewTab
          title='Join Our Twitter'
          reward={30000}
          completed={false}
        />
      </div>
    </div>
  )
}

function TaskCard({
  completed,
  image,
  reward,
  title,
  customAction,
  onClick,
  href,
  openInNewTab,
}: {
  image: ImageProps['src']
  title: string
  reward: number | string
  completed: boolean
  customAction?: React.ReactNode
  onClick?: () => void
  href?: string
  openInNewTab?: boolean
}) {
  const card = (
    <Card
      className='flex cursor-pointer items-center gap-2.5 bg-background-light p-2.5 transition hover:bg-background-lighter focus-visible:bg-background-lighter active:bg-background-lighter'
      onClick={onClick}
    >
      <Image src={image} alt='' className='h-14 w-14' />
      <div className='flex flex-col gap-1'>
        <span className='font-bold'>{title}</span>
        <div className='flex items-center gap-0.5'>
          <Image src={Diamond} alt='' className='relative top-px h-5 w-5' />
          <span className='text-text-muted'>
            +{typeof reward === 'number' ? formatNumber(reward) : reward}
          </span>
        </div>
      </div>
      <div className='ml-auto flex items-center justify-center pr-1'>
        {customAction ? (
          customAction
        ) : completed ? (
          <Check />
        ) : (
          <FaChevronRight className='text-text-muted' />
        )}
      </div>
    </Card>
  )
  if (href) {
    return (
      <Link target={openInNewTab ? '_blank' : undefined} href={href}>
        {card}
      </Link>
    )
  }
  return card
}

function NewTasks() {
  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
      <span className='font-bold'>🕔 New Tasks Soon!</span>
      <span className='text-sm font-medium text-text-muted'>
        Don’t miss them
      </span>
    </div>
  )
}
