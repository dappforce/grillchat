import dayjs from 'dayjs'
import gql from 'graphql-tag'
import {
  GetGeneralStatsByWeekQuery,
  GetGeneralStatsByWeekQueryVariables,
} from '../generated-query'
import { datahubQueryRequest, getDayAndWeekTimestamp } from '../utils'
import {
  GeneralStatistics,
  LeaderboardData,
  RewardHistory,
  TopUsers,
  UserStatistics,
} from './types'

const GET_TOP_USERS = gql`
  query GetTopUsers($from: String!) {
    creator: activeStakingAddressesRankedByRewardsForPeriod(
      args: {
        filter: { period: WEEK, role: CREATOR, timestamp: $from }
        limit: 3
        offset: 0
        order: DESC
      }
    ) {
      data {
        address
        reward
      }
    }
  }
`
export async function getTopUsers(): Promise<TopUsers> {
  const { week } = getDayAndWeekTimestamp()
  let startOfWeekTimestamp = dayjs.utc().startOf('day')
  let daysToMonday = startOfWeekTimestamp.day() - 1
  if (daysToMonday < 0) {
    daysToMonday += 7
  }
  startOfWeekTimestamp = startOfWeekTimestamp.subtract(daysToMonday, 'day')

  const res = await datahubQueryRequest<
    {
      creator: {
        data: {
          address: string
          reward: string
        }[]
      }
    },
    { from: string }
  >({
    document: GET_TOP_USERS,
    variables: { from: week.toString() },
  })

  return {
    creators: res.creator.data.map(({ address, reward }) => ({
      address,
      reward,
    })),
  }
}

const GET_USER_STATS = gql`
  query GetUserStats($address: String!, $timestamp: String!) {
    staker: activeStakingAddressRankByRewardsForPeriod(
      args: {
        address: $address
        period: WEEK
        role: STAKER
        timestamp: $timestamp
      }
    ) {
      rankIndex
    }
    creator: activeStakingAddressRankByRewardsForPeriod(
      args: {
        address: $address
        period: WEEK
        role: CREATOR
        timestamp: $timestamp
      }
    ) {
      rankIndex
    }
    activeStakingAccountActivityMetricsForFixedPeriod(
      args: {
        address: $address
        period: WEEK
        staker: {
          likedPosts: true
          likedCreators: true
          earnedByPeriod: true
          earnedTotal: true
        }
        creator: {
          likesCountByPeriod: true
          stakersWhoLiked: true
          earnedByPeriod: true
          earnedTotal: true
        }
      }
    ) {
      staker {
        likedCreators
        likedPosts
        earnedByPeriod
        earnedTotal
      }
      creator {
        likesCountByPeriod
        stakersWhoLiked
        earnedByPeriod
        earnedTotal
      }
    }
  }
`
export async function getUserStatistics({
  address,
}: {
  address: string
}): Promise<UserStatistics> {
  const res = await datahubQueryRequest<
    {
      staker: {
        reward: string
        rankIndex: number
      } | null
      creator: {
        reward: string
        rankIndex: number
      } | null
      activeStakingAccountActivityMetricsForFixedPeriod: {
        staker: {
          likedCreators: number
          likedPosts: number
          earnedByPeriod: string
          earnedTotal: string
        }
        creator: {
          likesCountByPeriod: number
          stakersWhoLiked: number
          earnedByPeriod: string
          earnedTotal: string
        }
      }
    },
    { address: string; timestamp: string }
  >({
    document: GET_USER_STATS,
    variables: { address, timestamp: getDayAndWeekTimestamp().week.toString() },
  })

  const creatorRank =
    res.creator?.rankIndex !== undefined ? res.creator.rankIndex + 1 : null
  const stakerRank =
    res.staker?.rankIndex !== undefined ? res.staker.rankIndex + 1 : null

  return {
    address,
    creator: {
      ...res.activeStakingAccountActivityMetricsForFixedPeriod.creator,
      rank: creatorRank,
    },
    staker: {
      ...res.activeStakingAccountActivityMetricsForFixedPeriod.staker,
      rank: stakerRank,
    },
  }
}

const GET_GENERAL_STATS_BY_WEEK = gql`
  query GetGeneralStatsByWeek {
    activeStakingTotalActivityMetricsForFixedPeriod(
      args: {
        period: WEEK
        likedPostsCount: true
        likedCreatorsCount: true
        stakersEarnedTotal: true
        creatorEarnedTotal: true
      }
    ) {
      likedPostsCount
      likedCreatorsCount
      stakersEarnedTotal
      creatorEarnedTotal
      creatorEarnedPointsTotal
      stakersEarnedPointsTotal
    }
  }
`
export async function getGeneralStatistics(): Promise<GeneralStatistics> {
  const res = await datahubQueryRequest<
    GetGeneralStatsByWeekQuery,
    GetGeneralStatsByWeekQueryVariables
  >({
    document: GET_GENERAL_STATS_BY_WEEK,
    variables: {},
  })

  const data = res.activeStakingTotalActivityMetricsForFixedPeriod
  return {
    creatorsEarnedTotal: data.creatorEarnedTotal ?? '',
    creatorsLiked: data.likedCreatorsCount ?? 0,
    postsLiked: data.likedPostsCount ?? 0,
    stakersEarnedTotal: data.stakersEarnedTotal ?? '',
    creatorEarnedPointsTotal: data.creatorEarnedPointsTotal ?? '',
    stakersEarnedPointsTotal: data.stakersEarnedPointsTotal ?? '',
  }
}

const GET_LEADERBOARD = gql`
  query GetLeaderboardTableData(
    $role: ActiveStakingAccountRole!
    $timestamp: String!
    $limit: Int!
    $offset: Int!
  ) {
    activeStakingAddressesRankedByRewardsForPeriod(
      args: {
        filter: { period: WEEK, role: $role, timestamp: $timestamp }
        limit: $limit
        offset: $offset
        order: DESC
      }
    ) {
      data {
        address
        reward
        rank
      }
      total
      limit
    }
  }
`
export const LEADERBOARD_PAGE_LIMIT = 15
export type LeaderboardRole = 'staker' | 'creator'
export async function getLeaderboardData({
  page,
  role,
}: {
  role: LeaderboardRole
  page: number
}): Promise<LeaderboardData> {
  const { week } = getDayAndWeekTimestamp()

  const offset = Math.max(page - 1, 0) * LEADERBOARD_PAGE_LIMIT
  const res = await datahubQueryRequest<
    {
      activeStakingAddressesRankedByRewardsForPeriod: {
        data: {
          address: string
          reward: string
          rank: number
        }[]
        total: number
        limit: number
      }
    },
    { role: string; timestamp: string; limit: number; offset: number }
  >({
    document: GET_LEADERBOARD,
    variables: {
      role: role === 'creator' ? 'CREATOR' : 'STAKER',
      timestamp: week.toString(),
      limit: LEADERBOARD_PAGE_LIMIT,
      offset,
    },
  })

  const data = res.activeStakingAddressesRankedByRewardsForPeriod

  const leaderboardData = data.data.map(({ rank, ...other }) => ({
    ...other,
    rank: rank !== undefined ? rank + 1 : null,
  }))

  return {
    data: leaderboardData,
    hasMore: data.total > data.limit + offset,
    total: data.total,
    page,
    role,
  }
}

const GET_REWARD_HISTORY = gql`
  query GetRewardHistory($address: String!) {
    activeStakingRewardsByWeek(args: { filter: { account: $address } }) {
      staker
      week
      creator {
        total
      }
    }
  }
`
export async function getRewardHistory(
  address: string
): Promise<RewardHistory> {
  const res = await datahubQueryRequest<
    {
      activeStakingRewardsByWeek: {
        staker: string
        week: number
        creator: {
          total: string
        }
      }[]
    },
    { address: string }
  >({
    document: GET_REWARD_HISTORY,
    variables: { address },
  })
  const rewards = res.activeStakingRewardsByWeek.map(
    ({ staker, week, creator }) => {
      const startDate = dayjs
        .utc()
        .year(week / 100)
        .isoWeek(week % 100)
        .startOf('week')
      const endDate = startDate.add(1, 'week')

      return {
        reward: staker,
        week,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        creatorReward: creator.total,
      }
    }
  )
  rewards.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return {
    address,
    rewards,
  }
}

const GET_ACTIVE_STAKING_STATS_BY_USER = gql`
  query GetActiveStakingStatsByUser($address: String!, $dayTimestamp: String!) {
    activeStakingAccountActivityMetricsForFixedPeriod(
      args: {
        address: $address
        period: DAY
        periodValue: $dayTimestamp
        staker: {
          likedPosts: false
          likedCreators: false
          earnedByPeriod: false
          earnedTotal: false
          earnedPointsByPeriod: true
        }
        creator: {
          likesCountByPeriod: false
          stakersWhoLiked: false
          earnedByPeriod: false
          earnedTotal: false
          earnedPointsByPeriod: true
        }
      }
    ) {
      staker {
        likedCreators
        likedPosts
        earnedByPeriod
        earnedTotal
        earnedPointsByPeriod
      }
      creator {
        likesCountByPeriod
        stakersWhoLiked
        earnedByPeriod
        earnedTotal
        earnedPointsByPeriod
      }
    }
  }
`

type DailyStatsByStakerResponse = {
  staker: {
    earnedPointsByPeriod: string
  }
  creator: {
    earnedPointsByPeriod: string
  }
}

export async function getActiveStakingStatsByUser({
  address,
  dayTimestamp,
}: {
  address: string
  dayTimestamp: number
}): Promise<{ address: string } & DailyStatsByStakerResponse> {
  const res = await datahubQueryRequest<{
    activeStakingAccountActivityMetricsForFixedPeriod: {
      address: string
    } & DailyStatsByStakerResponse
  }>({
    document: GET_ACTIVE_STAKING_STATS_BY_USER,
    variables: { address, dayTimestamp: dayTimestamp.toString() },
  })

  return {
    address,
    staker: {
      earnedPointsByPeriod:
        res.activeStakingAccountActivityMetricsForFixedPeriod.staker
          ?.earnedPointsByPeriod || '0',
    },
    creator: {
      earnedPointsByPeriod:
        res.activeStakingAccountActivityMetricsForFixedPeriod.creator
          ?.earnedPointsByPeriod || '0',
    },
  }
}

const GET_GENERAL_STATS_BY_PERIOD = gql`
  query GetGeneralStatsByPeriod($periodValue: String!) {
    activeStakingTotalActivityMetricsForFixedPeriod(
      args: {
        period: DAY
        periodValue: $periodValue
        likedPostsCount: false
        likedCreatorsCount: false
        stakersEarnedTotal: true
        creatorEarnedTotal: true
        creatorEarnedPointsTotal: true
        stakersEarnedPointsTotal: true
      }
    ) {
      stakersEarnedTotal
      creatorEarnedTotal
      creatorEarnedPointsTotal
      stakersEarnedPointsTotal
    }
  }
`
export async function getGeneralStatisticsByPeriod(
  periodValue: string
): Promise<GeneralStatistics> {
  const res = await datahubQueryRequest<
    {
      activeStakingTotalActivityMetricsForFixedPeriod: {
        likedPostsCount: number
        likedCreatorsCount: number
        stakersEarnedTotal: string
        creatorEarnedTotal: string
        creatorEarnedPointsTotal: string
        stakersEarnedPointsTotal: string
      }
    },
    { periodValue: string }
  >({
    document: GET_GENERAL_STATS_BY_PERIOD,
    variables: { periodValue },
  })

  const data = res.activeStakingTotalActivityMetricsForFixedPeriod
  return {
    creatorsEarnedTotal: data.creatorEarnedTotal,
    creatorsLiked: data.likedCreatorsCount,
    postsLiked: data.likedPostsCount,
    stakersEarnedTotal: data.stakersEarnedTotal,
    creatorEarnedPointsTotal: data.creatorEarnedPointsTotal,
    stakersEarnedPointsTotal: data.stakersEarnedPointsTotal,
  }
}
