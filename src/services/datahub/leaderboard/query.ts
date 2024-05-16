import { QueryConfig, createQuery } from '@/subsocial-query'
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
  LeaderboardRole,
  getActiveStakingStatsByUser,
  getGeneralStatistics,
  getGeneralStatisticsByPeriod,
  getLeaderboardData,
  getRewardHistory,
  getTopUsers,
  getUserReferrals,
  getUserStatistics,
} from '.'
import { LeaderboardData } from './types'

export const getTopUsersQuery = createQuery({
  key: 'getTopUsers',
  fetcher: getTopUsers,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getUserStatisticsQuery = createQuery({
  key: 'getUserStatistics',
  fetcher: getUserStatistics,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getActiveStakingStatsByUserQuery = createQuery({
  key: 'getActiveStakingStatsByUser',
  fetcher: getActiveStakingStatsByUser,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getGeneralStatisticsQuery = createQuery({
  key: 'getGeneralStatistics',
  fetcher: getGeneralStatistics,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getGeneralStatisticsByPeriodQuery = createQuery({
  key: 'getGeneralStatisticsByPeriod',
  fetcher: getGeneralStatisticsByPeriod,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getUserReferralsQuery = createQuery({
  key: 'getUserReferrals',
  fetcher: getUserReferrals,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getRewardHistoryQuery = createQuery({
  key: 'getRewardHistory',
  fetcher: getRewardHistory,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

const PROPOSALS_QUERY_KEY = 'leaderboardData'
const getQueryKey = (role: LeaderboardRole) => [
  `${role}-${PROPOSALS_QUERY_KEY}`,
]
export const getLeaderboardDataQuery = {
  getQueryKey,
  fetchFirstPageQuery: async (
    role: LeaderboardRole,
    client: QueryClient | null
  ) => {
    const res = await getLeaderboardData({
      page: 1,
      role,
    })
    if (!client) return res

    client.setQueryData(getQueryKey(role), {
      pageParams: [1],
      pages: [res],
    })
    return res
  },
  setFirstPageData: (
    role: LeaderboardRole,
    queryClient: QueryClient,
    data: LeaderboardData
  ) => {
    queryClient.setQueryData(getQueryKey(role), {
      pageParams: [1],
      pages: [data],
    })
  },
  useInfiniteQuery: (role: LeaderboardRole, config?: QueryConfig) => {
    return useInfiniteQuery<
      LeaderboardData,
      unknown,
      LeaderboardData,
      string[]
    >({
      ...config,
      queryKey: getQueryKey(role),
      queryFn: async ({ pageParam = 1 }) => {
        const res = await getLeaderboardData({
          page: pageParam,
          role,
        })
        return res
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    })
  },
}
