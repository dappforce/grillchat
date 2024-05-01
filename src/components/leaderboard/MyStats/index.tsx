import { getUserStatisticsQuery } from '@/services/datahub/leaderboard/query'
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

  const { data: userStats } = getUserStatisticsQuery.useQuery({
    address,
  })

  return (
    <div className='flex flex-col gap-4 md:gap-5'>
      <div className='flex grid-cols-[calc(70%-8px),30%] flex-col-reverse gap-4 md:grid md:gap-5'>
        <div className='flex flex-col gap-4'>
          <LeaderboardStatsData address={address} />
          <IncreaseStakeBanner />
        </div>
        <LeaderboardProfilePreview
          address={address}
          rank={userStats?.[leaderboardRole].rank || null}
        />
      </div>
      <div className='flex grid-cols-[calc(70%-8px),30%] flex-col gap-4 md:grid md:gap-5'>
        <LeaderboardTable
          role={leaderboardRole}
          currentUserRank={
            userStats
              ? {
                  address,
                  rank: userStats[leaderboardRole].rank,
                  reward: userStats[leaderboardRole].earnedByPeriod,
                }
              : undefined
          }
        />
        <StakerRewards address={address} />
      </div>
    </div>
  )
}

export default MyStats
