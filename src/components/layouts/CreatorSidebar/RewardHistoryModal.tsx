import { Skeleton } from '@/components/SkeletonFallback'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import {
  RewardHistory,
  getRewardHistoryQuery,
} from '@/old/services/datahub/content-staking/query'
import { useMyMainAddress } from '@/stores/my-account'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { ComponentProps, useMemo } from 'react'

export type RewardHistoryModalProps = ModalFunctionalityProps

export default function RewardHistoryModal({
  ...props
}: RewardHistoryModalProps) {
  const myAddress = useMyMainAddress() ?? ''
  const { data, isLoading } = getRewardHistoryQuery.useQuery(myAddress)
  const creatorRewards = data?.rewards.filter(
    (reward) => BigInt(reward.creatorReward) > 0
  )

  return (
    <Modal
      title='Content Staking History'
      titleClassName='font-semibold'
      {...props}
    >
      <RewardHistoryPanel
        title='Staker Rewards'
        loading={isLoading}
        rewardHistory={data}
        rewardType='staker'
      />

      {(creatorRewards?.length ?? 0) > 0 && (
        <div className='mt-3'>
          <RewardHistoryPanel
            title='Creator Rewards'
            rewardHistory={data}
            loading={isLoading}
            rewardType='creator'
          />
        </div>
      )}
    </Modal>
  )
}

export function RewardHistoryPanel({
  loading,
  rewardHistory,
  rewardType,
  description,
  title,
  ...props
}: {
  title: string
  description?: string
  rewardHistory: RewardHistory | undefined
  loading: boolean | undefined
  rewardType: 'staker' | 'creator'
} & ComponentProps<'div'>) {
  const rewards = useMemo(() => {
    return (
      rewardHistory?.rewards.filter((reward) => {
        const usedReward =
          rewardType === 'staker' ? reward.reward : reward.creatorReward
        return BigInt(usedReward) > 0
      }) ?? []
    )
  }, [rewardHistory, rewardType])

  return (
    <div {...props} className={clsx('flex flex-col', props.className)}>
      <span className={clsx('font-semibold', description ? 'text-lg' : 'mb-2')}>
        {title}
      </span>
      {description && (
        <span className='mb-2 text-sm text-text-muted'>{description}</span>
      )}
      <div className='flex flex-col gap-2'>
        {(() => {
          if (loading)
            return (
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full' />
                <Skeleton className='w-full' />
                <Skeleton className='w-full' />
              </div>
            )
          if (rewards.length === 0)
            return <span className='text-text-muted'>No rewards yet</span>

          return rewards.map((reward) => {
            const usedRewardValue =
              rewardType === 'creator' ? reward.creatorReward : reward.reward
            return (
              <div
                className='flex items-center justify-between gap-3'
                key={reward.week}
              >
                <span className='text-sm text-text-muted'>
                  {dayjs(reward.startDate).format('DD.MM.YY')} -{' '}
                  {dayjs(reward.endDate).format('DD.MM.YY')}
                </span>
                <span
                  className='font-semibold'
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + {formatBalanceWithDecimals(usedRewardValue)} SUB
                </span>
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}
