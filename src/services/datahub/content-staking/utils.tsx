import Toast from '@/components/Toast'
import { cx } from '@/utils/class-names'
import { QueryClient } from '@tanstack/react-query'
import { ReactNode } from 'react'
import toast from 'react-hot-toast'
import { SubscribeSuperLikeSubscription } from '../generated-query'
import { getSuperLikeCountQuery, getTodaySuperLikeCountQuery } from './query'

export function toastSuperLikeNotification(
  queryClient: QueryClient,
  eventData: SubscribeSuperLikeSubscription['activeStakingSuperLike'],
  myAddress: string | undefined
) {
  const { post, staker } = eventData.entity
  if (staker.id === myAddress && post.persistentId) {
    getSuperLikeCountQuery.invalidate(queryClient, post.persistentId)

    const todayLike = getTodaySuperLikeCountQuery.getQueryData(
      queryClient,
      myAddress
    )
    const remaining = 10 - todayLike.count
    let desc: ReactNode =
      'Great progress today! You used all the available likes. Come back tomorrow 😉'
    let icon: ((className: string) => ReactNode) | undefined = (className) => (
      <span
        className={cx(className, 'relative top-px mr-1.5 self-start text-base')}
      >
        ✅
      </span>
    )
    if (remaining > 0) {
      desc = (
        <div>
          <p>
            You earned 💎 {eventData.meta.stakerDistributedRewardPoints} Points
            for liking the meme.
          </p>
          <p className='text-text-muted'>
            {remaining} more likes left for today
          </p>
        </div>
      )
      icon = (className) => (
        <span
          className={cx(
            className,
            'relative top-px mr-1.5 self-start text-base'
          )}
        >
          ℹ️
        </span>
      )
    }
    toast.custom((t) => <Toast t={t} title={desc} icon={icon} />)
  }
}
