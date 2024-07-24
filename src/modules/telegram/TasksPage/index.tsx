import Diamond from '@/assets/emojis/diamond.png'
import Calendar from '@/assets/graphics/tasks/calendar.png'
import Like from '@/assets/graphics/tasks/like.png'
import Check from '@/assets/icons/check.svg'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import { Skeleton } from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import DailyRewardModal from '@/components/modals/DailyRewardModal'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import LikeCount from '@/modules/points/LikePreview'
import PointsWidget from '@/modules/points/PointsWidget'
import { getServerDayQuery } from '@/services/api/query'
import {
  getDailyRewardQuery,
  getTodaySuperLikeCountQuery,
  getTokenomicsMetadataQuery,
} from '@/services/datahub/content-staking/query'
import { getUserReferralStatsQuery } from '@/services/datahub/leaderboard/query'
import {
  clearGamificationTasksError,
  getGamificationTasksQuery,
} from '@/services/datahub/tasks/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import { useQueryClient } from '@tanstack/react-query'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { CSSProperties, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import SkeletonFallback from '../../../components/SkeletonFallback'
import ClaimTasksTokensModal, {
  ClaimModalVariant,
  modalConfigByVariant,
} from './ClaimTaskTokensModal'

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
        <BasicTasks />
        <DailyTasks />
        <InviteFriendsTasks />
        <NewTasks />
      </div>
    </LayoutWithBottomNavigation>
  )
}

function DailyTasks() {
  const sendEvent = useSendEvent()
  const [isOpen, setIsOpen] = useState(false)
  const myAddress = useMyMainAddress() ?? ''

  const { data: tokenomics } = getTokenomicsMetadataQuery.useQuery(null)
  const pointsPerSuperLike = tokenomics
    ? (tokenomics.likerRewardDistributionPercent / 100) *
      Number(tokenomics.superLikeWeightPoints)
    : 4000

  const { data: serverDay, isLoading: loadingServerDay } =
    getServerDayQuery.useQuery(null)
  const { data: dailyReward, isLoading: loadingDailyReward } =
    getDailyRewardQuery.useQuery(myAddress ?? '')
  const todayRewardIndex = dailyReward?.claims.findIndex(
    (claim) => Number(claim.claimValidDay) === serverDay?.day
  )

  const todayReward = dailyReward?.claims[todayRewardIndex || 0]
  const isTodayRewardClaimed = !!todayReward && !todayReward.openToClaim

  const { data: superLikeCount } = getTodaySuperLikeCountQuery.useQuery(
    myAddress ?? ''
  )

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
        <span className='self-center text-lg font-bold text-slate-300'>
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
            isLoadingReward={loadingServerDay || loadingDailyReward}
            customAction={
              <span className='flex w-fit items-center font-bold'>
                <SkeletonFallback
                  isLoading={loadingServerDay || loadingDailyReward}
                  className='w-fit min-w-[40px]'
                >
                  {(todayRewardIndex || 0) + 1}
                </SkeletonFallback>
                /7
              </span>
            }
          />
          <TaskCard
            image={Like}
            onClick={() => {
              sendEvent('tasks_like_open')
            }}
            title='Like 10 memes'
            href='/tg'
            reward={pointsPerSuperLike * 10}
            completed={(superLikeCount?.count ?? 0) >= 10}
            customAction={
              <span className='font-bold'>
                <LikeCount />
                /10
              </span>
            }
          />
        </div>
      </div>
    </>
  )
}

const inviteFriendsTasksName = 'INVITE_REFERRALS'

function InviteFriendsTasks() {
  const myAddress = useMyMainAddress()
  const sendEvent = useSendEvent()
  const [modalVariant, setModalVariant] = useState<ClaimModalVariant>(null)
  const client = useQueryClient()
  const { data: refStats } = getUserReferralStatsQuery.useQuery(myAddress || '')

  const { refCount } = refStats || {}

  const { data: gamificationTasks } = getGamificationTasksQuery.useQuery(
    myAddress || ''
  )

  const data =
    gamificationTasks?.data?.filter(
      (item) => item.name === inviteFriendsTasksName
    ) || []

  const { aim } =
    modalConfigByVariant[modalVariant || 'JOIN_TELEGRAM_CHANNEL_EpicAppNet']

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-0.5'>
        <span className='self-center text-lg font-bold text-slate-300'>
          Invite friends
        </span>
        <span className='self-center text-center text-sm text-slate-400'>
          For each{' '}
          <LinkText
            variant='primary'
            className='hover:no-underline'
            href='/tg/friends'
          >
            friend you invite
          </LinkText>
          , you earn 200K Points. You can earn additional points by completing
          the tasks:
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        {data.map((task, index) => {
          const tag = task.tag as Exclude<ClaimModalVariant, null>

          const { image, title, event } = modalConfigByVariant[tag]

          return (
            <TaskCard
              key={index}
              image={image}
              onClick={() => {
                sendEvent(event)

                if (task !== undefined && !task.claimed) {
                  clearGamificationTasksError(client)
                  setModalVariant(tag)
                }
              }}
              title={title}
              openInNewTab
              reward={parseInt(task.rewardPoints ?? '0')}
              completed={task.claimed ?? false}
            />
          )
        })}
      </div>
      <ClaimTasksTokensModal
        modalVariant={modalVariant}
        close={() => setModalVariant(null)}
        data={data || []}
        disableButton={aim && refCount ? refCount < aim : undefined}
      />
    </div>
  )
}

const basicTasksNames = ['JOIN_TELEGRAM_CHANNEL', 'JOIN_TWITTER']

function BasicTasks() {
  const sendEvent = useSendEvent()
  const [modalVariant, setModalVariant] = useState<ClaimModalVariant>(null)
  const myAddress = useMyMainAddress()
  const client = useQueryClient()

  const { data: gamificationTasks } = getGamificationTasksQuery.useQuery(
    myAddress || ''
  )

  const data =
    gamificationTasks?.data?.filter((item) =>
      basicTasksNames.includes(item.name)
    ) || []

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-0.5'>
        <span className='self-center text-lg font-bold text-slate-300'>
          Main Tasks
        </span>
        <span className='self-center text-center text-sm text-slate-400'>
          Join our social media and receive rewards later
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        {data.map((task, index) => {
          const tag = task.tag as Exclude<ClaimModalVariant, null>

          const variant = modalConfigByVariant[tag]
          if (!variant) return null
          const { image, title, event } = variant || {}

          return (
            <TaskCard
              key={index}
              image={image}
              onClick={() => {
                sendEvent(event)

                if (task !== undefined && !task.claimed) {
                  clearGamificationTasksError(client)
                  setModalVariant(tag)
                }
              }}
              title={title}
              openInNewTab
              reward={parseInt(task.rewardPoints ?? '0')}
              completed={task.claimed ?? false}
            />
          )
        })}
      </div>
      <ClaimTasksTokensModal
        modalVariant={modalVariant}
        close={() => setModalVariant(null)}
        data={data || []}
      />
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
  isLoadingReward,
  withoutDiamondIcon,
  topBanner,
}: {
  image: ImageProps['src']
  title: React.ReactNode
  reward: number | string
  completed: boolean
  customAction?: React.ReactNode
  onClick?: () => void
  href?: string
  openInNewTab?: boolean
  isLoadingReward?: boolean
  withoutDiamondIcon?: boolean
  topBanner?: {
    icon: JSX.Element
    text: string
    className?: string
    textStyle?: CSSProperties
    textClassName?: string
  }
}) {
  const card = (
    <Card className='flex cursor-pointer flex-col overflow-clip rounded-2xl p-0'>
      {topBanner && (
        <div className='bg-background'>
          <div
            className={cx(
              'flex items-center justify-center gap-1 py-1.5 text-xs',
              topBanner.className
            )}
          >
            <span className='text-sm'>{topBanner.icon}</span>
            <span
              className={cx('font-medium', topBanner.textClassName)}
              style={topBanner.textStyle}
            >
              {topBanner.text}
            </span>
          </div>
        </div>
      )}
      <div
        className='flex items-center gap-2.5 bg-background-light p-2.5 transition active:bg-background-lighter'
        onClick={onClick}
      >
        <Image src={image} alt='' className='h-14 w-14' />
        <div className='flex flex-col gap-1'>
          <span className='font-bold'>{title}</span>
          <div className='flex items-center gap-0.5'>
            {!withoutDiamondIcon && (
              <Image src={Diamond} alt='' className='relative top-px h-5 w-5' />
            )}
            {isLoadingReward ? (
              <Skeleton className='w-12' />
            ) : (
              <span className='text-text-muted'>
                {typeof reward === 'number'
                  ? `+${formatNumber(reward)}`
                  : reward}
              </span>
            )}
          </div>
        </div>
        <div className='ml-auto flex items-center justify-center pr-1'>
          {completed ? (
            <Check />
          ) : customAction ? (
            customAction
          ) : (
            <FaChevronRight className='text-text-muted' />
          )}
        </div>
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
