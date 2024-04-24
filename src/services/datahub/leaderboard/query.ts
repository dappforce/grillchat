import { createQuery } from '@/subsocial-query'
import {
  getGeneralStatistics,
  getLeaderboardData,
  getRewardHistory,
  getTopUsers,
  getUserStatistics,
} from '.'

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

export const getGeneralStatisticsQuery = createQuery({
  key: 'getGeneralStatistics',
  fetcher: getGeneralStatistics,
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

export const getLeaderboardDataQuery = createQuery({
  key: 'getLeaderboardData',
  fetcher: getLeaderboardData,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})
