import { createQuery } from '@/subsocial-query'
import {
  getLeaderboardData,
  getUserData,
  getUserReferrals,
  getUserReferralStats,
} from '.'

export const getUserReferralsQuery = createQuery({
  key: 'getUserReferrals',
  fetcher: getUserReferrals,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getUserReferralStatsQuery = createQuery({
  key: 'getUserReferralStats',
  fetcher: getUserReferralStats,
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getUserDataByAllTimeQuery = createQuery({
  key: 'userDataByAllTime',
  fetcher: (address: string) => getUserData(address, 'allTime'),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getUserDataByWeekQuery = createQuery({
  key: 'userDataByWeek',
  fetcher: (address: string) => getUserData(address, 'week'),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const userDataQueryByPeriod = {
  allTime: getUserDataByAllTimeQuery,
  week: getUserDataByWeekQuery,
}

export const getLeaderboardDataByAllTimeQuery = createQuery({
  key: 'leaderboardDataByAllTime',
  fetcher: () => getLeaderboardData('allTime'),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const getLeaderboardDataByWeekQuery = createQuery({
  key: 'leaderboardDataByWeek',
  fetcher: () => getLeaderboardData('week'),
  defaultConfigGenerator: (data) => ({
    enabled: !!data,
  }),
})

export const leaderboardDataQueryByPeriod = {
  allTime: getLeaderboardDataByAllTimeQuery,
  week: getLeaderboardDataByWeekQuery,
}
