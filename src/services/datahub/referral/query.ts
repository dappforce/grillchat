import { env } from '@/env.mjs'
import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetReferrerIdQuery,
  GetReferrerIdQueryVariables,
  ReferrersRankedListCustomPeriodKey,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_REFERRER_ID = gql`
  query GetReferrerId($address: String!) {
    socialProfiles(args: { where: { substrateAddresses: [$address] } }) {
      data {
        referrersList {
          referrerId
        }
      }
    }
  }
`
async function getReferrerId(address: string) {
  const res = await datahubQueryRequest<
    GetReferrerIdQuery,
    GetReferrerIdQueryVariables
  >({
    document: GET_REFERRER_ID,
    variables: { address },
  })

  return res.socialProfiles.data[0].referrersList?.[0]?.referrerId
}
export const getReferrerIdQuery = createQuery({
  key: 'getReferrerId',
  fetcher: getReferrerId,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const REFERRAL_LEADERBOARD_FRAGMENT = gql`
  fragment ReferralLeaderboardFragment on ReferrersRankedByReferralsCountForPeriodResponseDto {
    total
    limit
    offset
    data {
      address
      count
      rank
    }
  }
`

const GET_REFERRAL_LEADERBOARD_BY_ALL_TIME = gql`
  ${REFERRAL_LEADERBOARD_FRAGMENT}
  query GetReferralLeaderboard {
    referrersRankedByReferralsCountForPeriod(
      args: { filter: { period: ALL_TIME }, limit: 100 }
    ) {
      ...ReferralLeaderboardFragment
    }
  }
`

const GET_REFERRAL_LEADERBOARD_BY_CUSTOM_RANGE_KEY = gql`
  ${REFERRAL_LEADERBOARD_FRAGMENT}
  query GetReferralLeaderboardByCustomRangeKey(
    $customRangeKey: ReferrersRankedListCustomPeriodKey
  ) {
    referrersRankedByReferralsCountForPeriod(
      args: { filter: { customRangeKey: $customRangeKey }, limit: 100 }
    ) {
      ...ReferralLeaderboardFragment
    }
  }
`
async function getReferralLeaderboard(isContest: boolean) {
  const res = await datahubQueryRequest<
    {
      referrersRankedByReferralsCountForPeriod: {
        total: number
        data: {
          address: string
          count: number
          rank: number
        }[]
      }
    },
    { customRangeKey?: string }
  >({
    document: isContest
      ? GET_REFERRAL_LEADERBOARD_BY_CUSTOM_RANGE_KEY
      : GET_REFERRAL_LEADERBOARD_BY_ALL_TIME,
    variables: isContest
      ? {
          customRangeKey:
            ReferrersRankedListCustomPeriodKey[
              env.NEXT_PUBLIC_CONTEST_RANGE_KEY as keyof typeof ReferrersRankedListCustomPeriodKey
            ],
        }
      : {},
  })

  return {
    leaderboardData: res.referrersRankedByReferralsCountForPeriod.data,
    totalCount: res.referrersRankedByReferralsCountForPeriod.total,
  }
}

export const getReferralLeaderboardQuery = (isContest: boolean) =>
  createQuery({
    key: `getReferralLeaderboard-${isContest ? 'contest' : 'allTime'} `,
    fetcher: () => getReferralLeaderboard(isContest),
    defaultConfigGenerator: (address) => ({
      enabled: !!address,
    }),
  })

const REFERRER_RANK_FRAGMENT = gql`
  fragment ReferrerRankFragment on ReferrerRankByReferralsCountForPeriodResponseDto {
    count
    maxIndex
    rankIndex
  }
`

const GET_REFERRER_RANK_BY_ALL_TIME = gql`
  ${REFERRER_RANK_FRAGMENT}
  query GetReferrerRank($address: String!) {
    referrerRankByReferralsCountForPeriod(
      args: { address: $address, period: ALL_TIME, withCount: true }
    ) {
      ...ReferrerRankFragment
    }
  }
`

const GET_REFERRER_RANK_BY_CUSTOM_RANGE_KEY = gql`
  ${REFERRER_RANK_FRAGMENT}
  query GetReferrerRankByCustomRangeKey(
    $address: String!
    $customRangeKey: ReferrersRankedListCustomPeriodKey
  ) {
    referrerRankByReferralsCountForPeriod(
      args: {
        address: $address
        customRangeKey: $customRangeKey
        withCount: true
      }
    ) {
      ...ReferrerRankFragment
    }
  }
`

async function getReferrerRank(address: string, isContest: boolean) {
  const commonVariable = { address }

  const res = await datahubQueryRequest<
    {
      referrerRankByReferralsCountForPeriod: {
        count: number
        maxIndex: number
        rankIndex: number
      }
    },
    { address: string; customRangeKey?: string }
  >({
    document: isContest
      ? GET_REFERRER_RANK_BY_CUSTOM_RANGE_KEY
      : GET_REFERRER_RANK_BY_ALL_TIME,
    variables: isContest
      ? {
          ...commonVariable,
          customRangeKey:
            ReferrersRankedListCustomPeriodKey[
              env.NEXT_PUBLIC_CONTEST_RANGE_KEY as keyof typeof ReferrersRankedListCustomPeriodKey
            ],
        }
      : commonVariable,
  })

  return res.referrerRankByReferralsCountForPeriod
}

export const getReferrerRankQuery = (isContest: boolean) =>
  createQuery({
    key: `getReferrerRank-${isContest ? 'contest' : 'allTime'}`,
    fetcher: (address: string) => getReferrerRank(address, isContest),
    defaultConfigGenerator: (address) => ({
      enabled: !!address,
    }),
  })
