import { getTotalStakeQuery } from '@/services/datahub/content-staking/query'
import { useMyMainAddress } from '@/stores/my-account'
import OverviewCard from './OverviewCard'
import RewardInfoCard from './RewardInfoCard'

export default function CreatorSidebar() {
  const myAddress = useMyMainAddress() ?? ''
  const { isLoading, data: totalStake } = getTotalStakeQuery.useQuery(myAddress)

  // if (isLoading) return null

  return (
    <div className='flex flex-col gap-4'>
      <OverviewCard />
      {!totalStake?.hasStakedEnough && <RewardInfoCard />}
    </div>
  )
}
