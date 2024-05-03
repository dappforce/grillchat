import { getUserStatisticsQuery } from '@/services/datahub/leaderboard/query'
import { useGetLeaderboardRole } from '../utils'
import IncreaseStakeBanner from './IncreaseStakeBanner'
import LeaderboardProfilePreview from './LeaderboardProfilePreview'
import LeaderboardStatsData from './LeaderboardStatsData'
import LeaderboardTable from './LeaderboardTable'
import StakerRewards from './StakerRewards'

type MyStatsProps = {
  address: string
}

const MyStats = ({ address }: MyStatsProps) => {
  const { data: userStats } = getUserStatisticsQuery.useQuery({
    address,
  })

  const role = useGetLeaderboardRole()

  return (
    <div className='flex flex-col gap-4 md:gap-5'>
      <div className='flex grid-cols-[calc(70%-8px),30%] flex-col-reverse gap-4 md:grid md:gap-5'>
        <div className='flex flex-col gap-4'>
          <LeaderboardStatsData address={address} leaderboardRole={role} />
          <IncreaseStakeBanner />
        </div>
        <LeaderboardProfilePreview
          leaderboardRole={role}
          address={address}
          rank={userStats?.[role].rank || null}
        />
      </div>
      <div className='flex grid-cols-[calc(70%-8px),30%] flex-col gap-4 md:grid md:gap-5'>
        <LeaderboardTable
          role={role}
          currentUserRank={
            userStats
              ? {
                  address,
                  rank: userStats[role].rank,
                  reward: userStats[role].earnedByPeriod,
                }
              : undefined
          }
        />
        <StakerRewards address={address} leaderboardRole={role} />
      </div>
    </div>
  )
}

export default MyStats
