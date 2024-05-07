import LeaderboardPage from '@/modules/LeaderboardPage'
import {
  getGeneralStatisticsQuery,
  getLeaderboardDataQuery,
} from '@/services/datahub/leaderboard/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { AppCommonProps } from '../_app'

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async () => {
    const queryClient = new QueryClient()

    try {
      await Promise.all([
        getGeneralStatisticsQuery.fetchQuery(queryClient, {}),
        getLeaderboardDataQuery.fetchFirstPageQuery('staker', queryClient),
        getLeaderboardDataQuery.fetchFirstPageQuery('creator', queryClient),
      ])
    } catch (e) {
      console.error('Error fetching for leaderboard page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 2,
    }
  }
)

export default LeaderboardPage
