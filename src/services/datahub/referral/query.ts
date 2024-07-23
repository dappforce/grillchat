import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetReferrerIdQuery,
  GetReferrerIdQueryVariables,
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

const GET_REFERRAL_LEADERBOARD = gql`
  query GetReferralLeaderboard {
    referrersRankedByReferralsCountForPeriod(
      args: { filter: { period: ALL_TIME } }
    ) {
      total
      limit
      offset
      data {
        address
        count
        rank
      }
    }
  }
`
async function getReferralLeaderboard() {
  const res = await datahubQueryRequest<
    {
      referrersRankedByReferralsCountForPeriod: {
        data: {
          address: string
          count: number
          rank: number
        }[]
      }
    },
    {}
  >({
    document: GET_REFERRAL_LEADERBOARD,
  })

  return res.referrersRankedByReferralsCountForPeriod.data
}

export const getReferralLeaderboardQuery = createQuery({
  key: 'getReferralLeaderboard',
  fetcher: getReferralLeaderboard,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_REFERRER_RANK = gql`
  query GetReferrerRank($address: String!) {
    referrerRankByReferralsCountForPeriod(
      args: { address: $address, period: ALL_TIME, withCount: true }
    ) {
      count
      maxIndex
      rankIndex
    }
  }
`
async function getReferrerRank(address: string) {
  const res = await datahubQueryRequest<
    {
      referrerRankByReferralsCountForPeriod: {
        count: number
        maxIndex: number
        rankIndex: number
      }
    },
    { address: string }
  >({
    document: GET_REFERRER_RANK,
    variables: { address },
  })

  return res.referrerRankByReferralsCountForPeriod
}

export const getReferrerRankQuery = createQuery({
  key: 'getReferrerRank',
  fetcher: getReferrerRank,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
