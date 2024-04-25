import { useLeaderboardContext } from '../LeaderboardContext'
import IncreaseStakeBanner from './IncreaseStakeBanner'
import LeaderboardProfilePreview from './LeaderboardProfilePreview'
import LeaderboardStatsData from './LeaderboardStatsData'
import LeaderboardTable from './LeaderboardTable'
import StakerRewards from './StakerRewards'

type MyStatsProps = {
  address: string
}

const MyStats = ({ address }: MyStatsProps) => {
  const { leaderboardRole } = useLeaderboardContext()

  return (
    <div className='grid grid-cols-[calc(70%-8px),30%] gap-5'>
      <div className='flex flex-col gap-4'>
        <LeaderboardStatsData address={address} />
        <IncreaseStakeBanner address={address} />
        <LeaderboardTable role={leaderboardRole} />
      </div>
      <div className='flex flex-col gap-4'>
        <LeaderboardProfilePreview address={address} />
        <StakerRewards address={address} />
      </div>
    </div>
  )
}

export default MyStats
