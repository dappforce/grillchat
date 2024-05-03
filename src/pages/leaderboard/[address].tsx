import LeaderboardPage from '@/modules/LeaderboardPage'
import { getRewardHistoryQuery } from '@/services/datahub/content-staking/query'
import {
  getGeneralStatisticsQuery,
  getLeaderboardDataQuery,
  getUserStatisticsQuery,
} from '@/services/datahub/leaderboard/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { AppCommonProps } from '../_app'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<
  { address: string } & AppCommonProps
>(
  () => ({ alwaysShowScrollbarOffset: true }),
  async (context) => {
    const queryClient = new QueryClient()

    let { address } = context.params ?? {}
    if (!address) return undefined

    const addressString = address as string

    try {
      await Promise.all([
        getRewardHistoryQuery.fetchQuery(queryClient, addressString),
        getUserStatisticsQuery.fetchQuery(queryClient, {
          address: addressString,
        }),
        getGeneralStatisticsQuery.fetchQuery(queryClient, {}),
        getLeaderboardDataQuery.fetchFirstPageQuery('staker', queryClient),
        getLeaderboardDataQuery.fetchFirstPageQuery('creator', queryClient),
      ])
    } catch (e) {
      console.error(
        'Error fetching for leaderboard page by address: ',
        address,
        e
      )
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        address: addressString,
      },
      revalidate: 2,
    }
  }
)

export default LeaderboardPage
