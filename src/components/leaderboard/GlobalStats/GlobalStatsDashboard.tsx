import { getGeneralStatisticsQuery } from '@/services/datahub/leaderboard/query'
import { UserStatsCard } from '../MyStats/LeaderboardStatsData'

const GlobalStatsDashboard = () => {
  const { data: generalStats, isLoading } = getGeneralStatisticsQuery.useQuery(
    {}
  )

  const { stakersEarnedTotal, creatorsEarnedTotal, creatorsLiked, postsLiked } =
    generalStats || {}

  const data = [
    {
      title: 'Total posts and comments liked',
      value: postsLiked,
      tooltipText:
        'The total number of individual posts or comments that were liked at least one time this week',
      rank: null,
    },
    {
      title: 'Total SUB earned by stakers',
      value: stakersEarnedTotal,
      tooltipText:
        'The total amount of SUB rewards earned by stakers on Subsocial this week',
      rank: null,
    },
    {
      title: 'Total creators liked',
      value: creatorsLiked,
      tooltipText:
        'The total number of individual creators that had one of their posts or comments liked this week',
      rank: null,
    },
    {
      title: 'Total SUB earned by creators',
      value: creatorsEarnedTotal,
      tooltipText:
        'The total amount of SUB rewards earned by creators on Subsocial this week',
      rank: null,
    },
  ]

  return (
    <>
      {data.map((item, index) => (
        <UserStatsCard key={index} {...item} isLoading={isLoading} />
      ))}
    </>
  )
}

export default GlobalStatsDashboard
