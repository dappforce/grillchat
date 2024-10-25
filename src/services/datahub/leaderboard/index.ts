import gql from 'graphql-tag'
import {
  GetUserReferralsQuery,
  GetUserReferralsQueryVariables,
} from '../generated-query'
import { datahubQueryRequest, getDayAndWeekTimestamp } from '../utils'

const GET_LEADERBOARD_DATA_BY_ALL_TIME = gql`
  query GetLeaderboardTableDataByAllTime {
    activeStakingAddressesRankedByTotalRewardsForPeriod(
      args: { filter: { period: ALL_TIME }, limit: 100 }
    ) {
      total
      data {
        reward
        rank
        address
      }
    }
  }
`

const GET_LEADERBOARD_DATA_BY_WEEK = gql`
  query GetLeaderboardTableDataByWeek($timestamp: String!) {
    activeStakingAddressesRankedByTotalRewardsForPeriod(
      args: { filter: { period: WEEK, timestamp: $timestamp }, limit: 100 }
    ) {
      total
      data {
        reward
        rank
        address
      }
    }
  }
`

type Period = 'week' | 'allTime'

export async function getLeaderboardData(period: Period): Promise<any> {
  const { week } = getDayAndWeekTimestamp()
  const res = await datahubQueryRequest<any, any>({
    document:
      period === 'allTime'
        ? GET_LEADERBOARD_DATA_BY_ALL_TIME
        : GET_LEADERBOARD_DATA_BY_WEEK,
    variables: period === 'allTime' ? {} : { timestamp: week.toString() },
  })

  const data = res.activeStakingAddressesRankedByTotalRewardsForPeriod.data

  return {
    totalCount: res.activeStakingAddressesRankedByTotalRewardsForPeriod.total,
    leaderboardData: data.map((item: any) => ({
      rank: item.rank + 1,
      reward: item.reward,
      address: item.address,
    })),
  }
}

const GET_USER_DATA_BY_ALL_TIME = gql`
  query GetUserDataByAllTime($address: String!) {
    activeStakingAddressRankByTotalRewardsForPeriod(
      args: { period: ALL_TIME, address: $address, withReward: true }
    ) {
      rankIndex
      reward
    }
  }
`

const GET_USER_DATA_BY_WEEK = gql`
  query GetUserDataByWeek($address: String!, $timestamp: String!) {
    activeStakingAddressRankByTotalRewardsForPeriod(
      args: {
        period: WEEK
        address: $address
        withReward: true
        timestamp: $timestamp
      }
    ) {
      rankIndex
      reward
    }
  }
`

export async function getUserData(
  address: string,
  period: Period
): Promise<any> {
  const { week } = getDayAndWeekTimestamp()
  const res = await datahubQueryRequest<any, any>({
    document:
      period === 'allTime' ? GET_USER_DATA_BY_ALL_TIME : GET_USER_DATA_BY_WEEK,
    variables:
      period === 'allTime'
        ? { address }
        : { address, timestamp: week.toString() },
  })

  const data = res.activeStakingAddressRankByTotalRewardsForPeriod

  if (!data) {
    return
  }

  return {
    address,
    rank: data.rankIndex + 1,
    reward: data.reward,
  }
}

const GET_USER_REFERRALS = gql`
  query GetUserReferrals($address: String!) {
    userReferrals(
      args: {
        where: { referrerIds: [$address] }
        responseParams: { withDistributedRewards: true }
      }
    ) {
      data {
        referrerId
        referralsCount
        distributedRewards {
          totalPoints
        }
      }
    }
  }
`
export async function getUserReferrals(
  address: string
): Promise<{ refCount: number; pointsEarned: number }> {
  const res = await datahubQueryRequest<
    GetUserReferralsQuery,
    GetUserReferralsQueryVariables
  >({
    document: GET_USER_REFERRALS,
    variables: { address },
  })

  const data = res.userReferrals.data[0]

  return {
    refCount: data.referralsCount ?? 0,
    pointsEarned: parseInt(
      data.distributedRewards?.totalPoints?.toString() ?? '0'
    ),
  }
}

const GET_USER_REFERRAL_STATS = gql`
  query getUserReferralsStats($address: String!) {
    userReferralsStats(
      args: {
        where: { referrerId: $address }
        responseParams: {
          withReferralsList: true
          withDistributedRewards: true
        }
        referralsListParams: { pageSize: 100 }
      }
    ) {
      referrerId
      distributedRewards {
        totalPoints
      }
      referrals {
        total
        pageSize
        offset
        data {
          timestamp
          socialProfile {
            id
          }
        }
      }
    }
  }
`

export async function getUserReferralStats(address: string) {
  const res = await datahubQueryRequest<
    {
      userReferralsStats: {
        referrerId: string
        distributedRewards: {
          totalPoints: string
        }
        referrals: {
          total: number
          data: {
            timestamp: string
            socialProfile: {
              id: string
            }
          }[]
        }
      }
    },
    GetUserReferralsQueryVariables
  >({
    document: GET_USER_REFERRAL_STATS,
    variables: { address },
  })

  const data = res.userReferralsStats

  return {
    refCount: data.referrals.total ?? 0,
    pointsEarned: data.distributedRewards.totalPoints.toString() ?? '0',
    referrals: data.referrals.data.map((referral) => ({
      timestamp: referral.timestamp,
      socialProfileId: referral.socialProfile.id,
    })),
  }
}
