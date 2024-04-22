import { Skeleton } from '@/components/SkeletonFallback'
import { getTotalStakeQuery } from '@/services/datahub/content-staking/query'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import OverviewCard from './OverviewCard'
import RewardInfoCard from './RewardInfoCard'

export default function CreatorSidebar() {
  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  const myAddress = useMyMainAddress() ?? ''
  const { isLoading, data: totalStake } = getTotalStakeQuery.useQuery(myAddress)

  if (!isInitializedProxy || (isLoading && myAddress))
    return (
      <div className='flex animate-pulse flex-col rounded-2xl bg-background-light'>
        <div className='flex flex-col gap-1 border-b border-border-gray p-4'>
          <Skeleton className='w-48 text-lg' />
          <Skeleton className='w-32 text-sm' />
        </div>
        <div className='flex flex-col gap-3 p-4 text-sm'>
          <Skeleton className='w-full' />
          <Skeleton className='w-full' />
          <Skeleton className='w-full' />
          <Skeleton className='w-full' />
        </div>
      </div>
    )

  return (
    <div className='flex flex-col gap-4'>
      <OverviewCard />
      {totalStake?.hasStakedEnough && <RewardInfoCard />}
    </div>
  )
}
