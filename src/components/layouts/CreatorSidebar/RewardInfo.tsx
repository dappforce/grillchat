import { Skeleton } from '@/components/SkeletonFallback'
import PopOver from '@/components/floating/PopOver'
import {
  PostRewards,
  RewardReport,
  getRewardReportQuery,
  getTotalStakeQuery,
} from '@/services/datahub/content-staking/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { WithRequired } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ComponentProps, useState } from 'react'
import { AiOutlineLineChart } from 'react-icons/ai'
import { RiHistoryFill } from 'react-icons/ri'
import { SlQuestion } from 'react-icons/sl'
import CustomLink from 'src/components/referral/CustomLink'
import { getLeaderboardLink } from '../Sidebar'
import RewardHistoryModal from './RewardHistoryModal'
import StakerRewardProgressBar, {
  StakerRewardProgressBarProps,
} from './StakerRewardProgressBar'
import { CREATORS_CONSTANTS } from './utils'

const { getDistributionDaysLeft, SUPER_LIKES_FOR_MAX_REWARD } =
  CREATORS_CONSTANTS

export type RewardInfoProps = ComponentProps<'div'> & {
  size?: StakerRewardProgressBarProps['size']
}

export default function RewardInfo({ size, ...props }: RewardInfoProps) {
  const sendEvent = useSendEvent()
  const myAddress = useMyMainAddress() ?? ''
  const { data: totalStake } = getTotalStakeQuery.useQuery(myAddress)
  const [isOpenRewardHistoryModal, setIsOpenRewardHistoryModal] =
    useState(false)
  const { data, isLoading } = getRewardReportQuery.useQuery(myAddress)

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 p-3 text-sm'>
        <Skeleton className='w-full' />
        <Skeleton className='w-full' />
        <Skeleton className='w-full' />
        <Skeleton className='w-full' />
      </div>
    )
  }

  const hasCreatorReward =
    (data?.receivedLikes ?? 0) > 0 || (data?.creatorReward ?? '0') !== '0'

  return (
    <div {...props} className={cx('flex flex-col px-4 py-3', props.className)}>
      <StakerRewardInfo rewardReport={data} size={size} loading={isLoading} />
      {hasCreatorReward && (
        <>
          <div className='mt-3.5 border-t border-border-gray pt-3' />
          <CreatorRewardInfo
            rewardReport={data!}
            size={size}
            loading={isLoading}
          />
        </>
      )}
      <div
        className='mt-4 whitespace-nowrap border-t border-border-gray'
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          marginLeft: '-1rem',
          marginBottom: '-0.75rem',
          width: 'calc(100% + 2rem)',
        }}
      >
        <div
          className='flex items-center justify-center gap-2 border-r border-border-gray px-4 py-3.5 font-medium text-text-primary'
          onClick={() => {
            sendEvent('astake_reward_history_opened', {})
            setIsOpenRewardHistoryModal(true)
          }}
          style={{
            cursor: 'pointer',
            flex: 1,
          }}
        >
          <RiHistoryFill />
          <span className='text-sm'>History</span>
        </div>

        <CustomLink
          className='flex items-center justify-center gap-2 px-4 py-3.5 font-medium text-text-primary'
          href={`${getLeaderboardLink(myAddress)}?role=staker`}
          onClick={() => {
            sendEvent('leaderboard_my_stats_opened', {
              myStats: true,
              eventSource: 'my_stats_banner',
              role: 'staker',
            })
          }}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          <AiOutlineLineChart />
          <span className='text-sm'>My Stats</span>
        </CustomLink>
      </div>

      <RewardHistoryModal
        isOpen={isOpenRewardHistoryModal}
        closeModal={() => setIsOpenRewardHistoryModal(false)}
      />
    </div>
  )
}

type InnerRewardInfoProps = {
  rewardReport: RewardReport | undefined
  loading?: boolean
} & Pick<RewardInfoProps, 'size'>

function StakerRewardInfo({
  rewardReport,
  loading,
  size,
}: InnerRewardInfoProps) {
  const todayReward = rewardReport?.currentRewardAmount ?? '0'
  const weekReward = rewardReport?.weeklyReward ?? '0'

  const likeCount = rewardReport?.superLikesCount ?? 0
  const likesToMaxReward = SUPER_LIKES_FOR_MAX_REWARD - likeCount

  const dayLeftUntilDistribution = getDistributionDaysLeft()

  return (
    <div className={clsx('flex flex-col text-sm')}>
      <span
        className={clsx(
          'pb-2 font-semibold',
          size === 'small' ? 'text-sm' : 'text-base'
        )}
      >
        Staker Rewards
      </span>
      <div className={clsx('flex flex-col pb-1')}>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>
              {likesToMaxReward > 0
                ? 'Daily activity target'
                : 'Daily target hit'}
            </span>
            <PopOver
              triggerOnHover
              panelSize='sm'
              trigger={<SlQuestion className='text-xs text-text-muted' />}
            >
              <>
                <p className='mb-2'>
                  Each post or comment you like today, up to a maximum of 10,
                  will boost your rewards, and reward the authors of the posts
                  or comments you like.
                </p>
                <p className='mb-0'>
                  Liking more than 10 posts or comments will spread the author
                  rewards across more authors, resulting in each author
                  receiving fewer rewards.
                </p>
              </>
            </PopOver>
          </div>
          <StakerSuperLikeCount />
        </div>
        <StakerRewardProgressBar size={size} className='mt-1.5' />
      </div>
      <div className='mt-2 flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Earned today</span>
            <PopOver
              trigger={<SlQuestion className='text-xs text-text-muted' />}
              triggerOnHover
              panelSize='sm'
            >
              <span>
                The minimum bonus rewards you have earned today from Content
                Staking, which may increase depending on network activity
              </span>
            </PopOver>
          </div>
          <span className='flex items-center gap-2 font-semibold'>
            {loading ? (
              <NumberSkeleton />
            ) : (
              <span>
                <span className='text-text-muted'>≥</span>{' '}
                {formatBalanceWithDecimals(todayReward)} SUB
              </span>
            )}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Earned this week</span>
            <PopOver
              panelSize='sm'
              triggerOnHover
              trigger={<SlQuestion className='text-xs text-text-muted' />}
            >
              The bonus rewards you have earned this week from participating in
              Content Staking
            </PopOver>
          </div>
          <span className='flex items-center gap-2 font-semibold'>
            {loading ? (
              <NumberSkeleton />
            ) : (
              <span>
                <span className='text-text-muted'>≥</span>{' '}
                {formatBalanceWithDecimals(weekReward)} SUB
              </span>
            )}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Distribution in</span>
            <PopOver
              trigger={<SlQuestion className='text-xs text-text-muted' />}
              panelSize='sm'
              triggerOnHover
            >
              The amount of time remaining until your bonus rewards for this
              week are deposited into your account
            </PopOver>
          </div>
          <span className='font-semibold'>
            <Pluralize
              count={dayLeftUntilDistribution}
              singularText='day'
              pluralText='days'
            />
          </span>
        </div>
      </div>
    </div>
  )
}

function generateTooltipForCreatorEarned({
  fromCommentSuperLikes,
  fromDirectSuperLikes,
  fromShareSuperLikes,
}: PostRewards['rewardsBySource']) {
  return (
    <div>
      <span>
        The minimum amount of SUB that you will earn as a result of your posts
        and comments being superliked this week
      </span>
      <ul className='mb-1 pl-3'>
        <li>
          {formatBalanceWithDecimals(fromDirectSuperLikes)} SUB from direct
          likes on your posts and comments
        </li>
        {BigInt(fromCommentSuperLikes) > 0 && (
          <li>
            {formatBalanceWithDecimals(fromCommentSuperLikes)} SUB from the
            likes on comments to your posts and comments
          </li>
        )}
        {BigInt(fromShareSuperLikes) > 0 && (
          <li>
            {formatBalanceWithDecimals(fromShareSuperLikes)} SUB from the likes
            on shared posts of your posts and comments
          </li>
        )}
      </ul>
    </div>
  )
}
function CreatorRewardInfo({
  rewardReport,
  loading,
  size,
}: WithRequired<InnerRewardInfoProps, 'rewardReport'>) {
  return (
    <div className={clsx('flex flex-col text-sm')}>
      <span
        className={clsx(
          'pb-2 font-semibold',
          size === 'small' ? 'text-sm' : 'text-base'
        )}
      >
        Creator Rewards
      </span>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Received likes</span>
            <PopOver
              panelSize='sm'
              trigger={<SlQuestion className='text-xs text-text-muted' />}
            >
              The amount of times your posts and comments have been superliked
              this week
            </PopOver>
          </div>
          <span className='flex items-center gap-2 font-semibold'>
            {loading ? (
              <NumberSkeleton />
            ) : (
              <span>{rewardReport.receivedLikes}</span>
            )}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Earned from posts</span>
            <PopOver
              triggerOnHover
              panelSize='sm'
              trigger={<SlQuestion className='text-xs text-text-muted' />}
            >
              {generateTooltipForCreatorEarned(
                rewardReport.creatorRewardBySource
              )}
            </PopOver>
          </div>
          <span className='flex items-center gap-2 font-semibold'>
            {loading ? (
              <NumberSkeleton />
            ) : (
              <span>
                <span className='text-text-muted'>≥</span>{' '}
                {formatBalanceWithDecimals(rewardReport.creatorReward)} SUB
              </span>
            )}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Daily calculation in</span>
            <PopOver
              trigger={<SlQuestion className='text-xs text-text-muted' />}
              panelSize='sm'
              triggerOnHover
            >
              The amount of time remaining until the reward is updated
            </PopOver>
          </div>
          <span className='font-semibold'>
            <Pluralize
              count={dayjs.utc().endOf('day').diff(dayjs.utc(), 'hour')}
              singularText='hour'
              pluralText='hours'
            />
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-text-muted'>Distribution in</span>
            <PopOver
              trigger={<SlQuestion className='text-xs text-text-muted' />}
              triggerOnHover
              panelSize='sm'
            >
              The amount of time remaining until your bonus rewards for this
              week are deposited into your account
            </PopOver>
          </div>
          <span className='font-semibold'>
            <Pluralize
              count={CREATORS_CONSTANTS.getDistributionDaysLeft()}
              singularText='day'
              pluralText='days'
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export function StakerSuperLikeCount() {
  const myAddress = useMyMainAddress() ?? ''
  const { data, isLoading } = getRewardReportQuery.useQuery(myAddress)

  const likeCount = data?.superLikesCount ?? 0
  const surplusLikes = likeCount - SUPER_LIKES_FOR_MAX_REWARD

  return (
    <span className='flex items-center font-semibold'>
      {isLoading ? (
        <NumberSkeleton />
      ) : (
        <>
          <span>{Math.min(likeCount, SUPER_LIKES_FOR_MAX_REWARD)}</span>
          {surplusLikes > 0 && <span>+{surplusLikes}</span>}
        </>
      )}{' '}
      <span className='ml-1 text-text-muted'>likes</span>
    </span>
  )
}
function NumberSkeleton() {
  return <Skeleton className='w-[3ch]' />
}

function Pluralize({
  count,
  singularText,
  pluralText,
}: {
  count: number
  singularText: string
  pluralText: string
}) {
  return (
    <span>
      {count} {count > 1 ? pluralText : singularText}
    </span>
  )
}
