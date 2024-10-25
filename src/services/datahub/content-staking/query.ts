import { MINIMUM_LOCK } from '@/constants/subsocial'
import { ApiDatahubSuperLikeGetResponse } from '@/pages/api/datahub/super-like'
import { apiInstance } from '@/services/api/utils'
import { getSubIdRequest } from '@/services/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { LocalStorage } from '@/utils/storage'
import { parseJSONData } from '@/utils/strings'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import {
  GetAddressLikeCountToPostsQuery,
  GetAddressLikeCountToPostsQueryVariables,
  GetCanPostsSuperLikedQuery,
  GetCanPostsSuperLikedQueryVariables,
  GetDailyRewardQuery,
  GetDailyRewardQueryVariables,
  GetPostRewardsQuery,
  GetPostRewardsQueryVariables,
  GetSuperLikeCountsQuery,
  GetSuperLikeCountsQueryVariables,
  GetTodaySuperLikeCountQuery,
  GetTodaySuperLikeCountQueryVariables,
  GetTokenomicsMetadataQuery,
  GetTokenomicsMetadataQueryVariables,
  GetUserYesterdayRewardQuery,
  GetUserYesterdayRewardQueryVariables,
} from '../generated-query'
import { datahubQueryRequest, getDayAndWeekTimestamp } from '../utils'

const GET_SUPER_LIKE_COUNTS = gql`
  query GetSuperLikeCounts($postIds: [String!]!) {
    activeStakingSuperLikeCountsByPost(args: { postPersistentIds: $postIds }) {
      persistentPostId
      count
    }
  }
`
type SuperLikeCount = {
  postId: string
  count: number
}
const getSuperLikeCounts = poolQuery<string, SuperLikeCount>({
  name: 'getSuperLikeCounts',
  multiCall: async (postIds) => {
    const res = await datahubQueryRequest<
      GetSuperLikeCountsQuery,
      GetSuperLikeCountsQueryVariables
    >({
      document: GET_SUPER_LIKE_COUNTS,
      variables: { postIds },
    })

    const resultMap = new Map<string, SuperLikeCount>()
    res.activeStakingSuperLikeCountsByPost.forEach((item) => {
      if (!item.persistentPostId) return
      resultMap.set(item.persistentPostId, {
        postId: item.persistentPostId,
        count: item.count,
      })
    })

    return postIds.map(
      (postId) => resultMap.get(postId) ?? { postId, count: 0 }
    )
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result.postId,
  },
})
export const getSuperLikeCountQuery = createQuery({
  key: 'getSuperLikeCount',
  fetcher: getSuperLikeCounts,
  defaultConfigGenerator: (param) => ({
    enabled: !!param,
  }),
})

const GET_ADDRESS_LIKE_COUNT_TO_POSTS = gql`
  query GetAddressLikeCountToPosts($address: String!, $postIds: [String!]!) {
    activeStakingSuperLikeCountsByStaker(
      args: { postPersistentIds: $postIds, address: $address }
    ) {
      persistentPostId
      count
    }
  }
`
type AddressLikeCountToPost = {
  postId: string
  count: number
  address: string
}
const getAddressLikeCountToPosts = poolQuery<
  { postId: string; address: string },
  AddressLikeCountToPost
>({
  name: 'getAddressLikeCountToPosts',
  multiCall: async (params) => {
    if (!params.length) return []
    const addressesToPostIdsMap = new Map<string, string[]>()
    params.forEach((param) => {
      const postIds = addressesToPostIdsMap.get(param.address) || []
      postIds.push(param.postId)
      addressesToPostIdsMap.set(param.address, postIds)
    })

    const promises: Promise<AddressLikeCountToPost[]>[] = []
    async function fetchAddressLikeCount(address: string, postIds: string[]) {
      const addressResults = await datahubQueryRequest<
        GetAddressLikeCountToPostsQuery,
        GetAddressLikeCountToPostsQueryVariables
      >({
        document: GET_ADDRESS_LIKE_COUNT_TO_POSTS,
        variables: { postIds, address },
      })
      return addressResults.activeStakingSuperLikeCountsByStaker.map(
        (item) => ({
          postId: item.persistentPostId || '',
          count: item.count,
          address,
        })
      )
    }
    addressesToPostIdsMap.forEach((postIds, address) => {
      promises.push(fetchAddressLikeCount(address, postIds))
    })

    const results = await Promise.all(promises)
    return results.flat()
  },
  resultMapper: {
    paramToKey: (param) => `${param.postId}-${param.address}`,
    resultToKey: (result) => `${result.postId}-${result.address}`,
  },
})
export const getAddressLikeCountToPostQuery = createQuery({
  key: 'getAddressLikeCountToPost',
  fetcher: getAddressLikeCountToPosts,
  defaultConfigGenerator: (param) => ({
    enabled: !!(param?.address && param.postId),
  }),
})

const GET_CAN_POSTS_SUPER_LIKED = gql`
  query GetCanPostsSuperLiked($postIds: [String!]!) {
    activeStakingCanDoSuperLikeByPost(args: { postPersistentIds: $postIds }) {
      persistentPostId
      validByCreationDate
      validByCreatorMinStake
      validByLowValue
    }
  }
`
export type CanPostSuperLiked = {
  postId: string
  canPostSuperLiked: boolean
  validByCreationDate: boolean
  validByCreatorMinStake: boolean
  validByLowValue: boolean
  isExist: boolean
}
const getCanPostsSuperLiked = poolQuery<string, CanPostSuperLiked>({
  name: 'getCanPostsSuperLiked',
  multiCall: async (postIds) => {
    const res = await datahubQueryRequest<
      GetCanPostsSuperLikedQuery,
      GetCanPostsSuperLikedQueryVariables
    >({
      document: GET_CAN_POSTS_SUPER_LIKED,
      variables: { postIds },
    })

    const resultMap = new Map<string, CanPostSuperLiked>()
    res.activeStakingCanDoSuperLikeByPost.forEach((item) => {
      resultMap.set(item.persistentPostId, {
        postId: item.persistentPostId,
        validByCreationDate: item.validByCreationDate,
        validByCreatorMinStake: item.validByCreatorMinStake,
        validByLowValue: item.validByLowValue,
        isExist: true,
        canPostSuperLiked:
          item.validByCreationDate && item.validByCreatorMinStake,
      })
    })

    return postIds.map(
      (postId) =>
        resultMap.get(postId) ?? {
          postId,
          validByCreationDate: false,
          validByCreatorMinStake: false,
          validByLowValue: false,
          canPostSuperLiked: false,
          isExist: false,
        }
    )
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result.postId,
  },
})
export const getCanPostSuperLikedQuery = createQuery({
  key: 'getCanPostSuperLiked',
  fetcher: getCanPostsSuperLiked,
  defaultConfigGenerator: (param) => ({
    enabled: !!param,
  }),
})

const GET_POST_REWARDS = gql`
  query GetPostRewards($postIds: [String!]!) {
    activeStakingRewardsByPosts(args: { postPersistentIds: $postIds }) {
      postId
      draftPointsRewardTotal
      pointsRewardTotal
      pointsRewardsBySource {
        fromDirectSuperLikes
      }
      draftPointsRewardsBySource {
        fromDirectSuperLikes
      }
    }
  }
`
function parseToBigInt(value: string | undefined | null) {
  if (!value) return BigInt(0)
  return BigInt(value.split('.')[0])
}
export type PostRewards = {
  postId: string
  reward: string
  isNotZero: boolean
  rewardDetail: {
    finalizedReward: string
    draftReward: string
  }
  rewardsBySource: {
    fromDirectSuperLikes: string
  }
}
const getPostRewards = poolQuery<string, PostRewards>({
  name: 'getPostRewards',
  multiCall: async (postIds) => {
    const res = await datahubQueryRequest<
      GetPostRewardsQuery,
      GetPostRewardsQueryVariables
    >({
      document: GET_POST_REWARDS,
      variables: { postIds },
    })

    const resultMap = new Map<string, PostRewards>()
    res.activeStakingRewardsByPosts.forEach((item) => {
      const {
        pointsRewardTotal,
        pointsRewardsBySource,
        draftPointsRewardsBySource,
        draftPointsRewardTotal,
      } = item
      const total =
        parseToBigInt(pointsRewardTotal) + parseToBigInt(draftPointsRewardTotal)
      if (!item.postId) return

      resultMap.set(item.postId, {
        postId: item.postId,
        reward: total.toString(),
        isNotZero: total > 0,
        rewardDetail: {
          draftReward: draftPointsRewardTotal,
          finalizedReward: pointsRewardTotal,
        },
        rewardsBySource: {
          fromDirectSuperLikes: (
            parseToBigInt(pointsRewardsBySource?.fromDirectSuperLikes) +
            parseToBigInt(draftPointsRewardsBySource?.fromDirectSuperLikes)
          ).toString(),
        },
      })
    })

    return postIds.map(
      (postId) =>
        resultMap.get(postId) ?? {
          postId,
          reward: '0',
          draftReward: '0',
          isNotZero: false,
          rewardDetail: {
            draftReward: '0',
            finalizedReward: '0',
          },
          rewardsBySource: {
            fromDirectSuperLikes: '0',
          },
        }
    )
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result.postId,
  },
})
export const getPostRewardsQuery = createQuery({
  key: 'getPostRewards',
  fetcher: getPostRewards,
  defaultConfigGenerator: (param) => ({
    enabled: !!param,
  }),
})

const getTotalStake = async (address: string) => {
  const res = await getSubIdRequest().get(
    `/staking/creator/backer/ledger?account=${address}`
  )
  const totalStake = (res?.data?.totalLocked as string) || ''
  const stakeAmount = BigInt(totalStake)

  return {
    amount: stakeAmount.toString(),
    hasStakedEnough: stakeAmount > MINIMUM_LOCK,
  }
}
export const getTotalStakeQuery = createQuery({
  key: 'getTotalStake',
  fetcher: getTotalStake,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

export const getConfirmationMsgQuery = createQuery({
  key: 'getConfirmationMsg',
  fetcher: async () => {
    const res = await apiInstance.get<
      any,
      AxiosResponse<ApiDatahubSuperLikeGetResponse>,
      any
    >('/api/datahub/super-like')
    return res.data.data ?? ''
  },
})

export type RewardReport = {
  superLikesCount: number
  currentRewardAmount: string
  weeklyReward: string

  creatorReward: string
  creatorRewardBySource: {
    fromDirectSuperLikes: string
    fromCommentSuperLikes: string
    fromShareSuperLikes: string
  }
  receivedLikes: number

  address: string
}
const GET_REWARD_REPORT = gql`
  query GetRewardReport($address: String!, $day: Int!, $week: Int!) {
    activeStakingDailyStatsByStaker(
      args: { address: $address, dayTimestamp: $day }
    ) {
      superLikesCount
      currentRewardAmount
    }
    activeStakingRewardsByWeek(
      args: { weeks: [$week], filter: { account: $address } }
    ) {
      staker
      creator {
        total
        rewardsBySource {
          fromDirectSuperLikes
          fromCommentSuperLikes
          fromShareSuperLikes
        }
        posts {
          superLikesCount
        }
      }
    }
  }
`
export async function getRewardReport(address: string): Promise<RewardReport> {
  const res = await datahubQueryRequest<
    {
      activeStakingDailyStatsByStaker: {
        superLikesCount: number
        currentRewardAmount: string
      }
      activeStakingRewardsByWeek: {
        staker: string
        creator: {
          total: string
          rewardsBySource?: {
            fromDirectSuperLikes: string
            fromCommentSuperLikes: string
            fromShareSuperLikes: string
          }
          posts: {
            superLikesCount: number
          }[]
        }
      }[]
    },
    { address: string; day: number; week: number }
  >({
    document: GET_REWARD_REPORT,
    variables: { address, ...getDayAndWeekTimestamp() },
  })
  const weekReward = res.activeStakingRewardsByWeek?.[0]

  return {
    ...res.activeStakingDailyStatsByStaker,
    weeklyReward: weekReward?.staker ?? '0',
    creatorReward: weekReward?.creator.total ?? '0',
    creatorRewardBySource: weekReward?.creator.rewardsBySource ?? {
      fromDirectSuperLikes: '0',
      fromCommentSuperLikes: '0',
      fromShareSuperLikes: '0',
    },
    receivedLikes:
      weekReward?.creator.posts.reduce(
        (acc, post) => acc + post.superLikesCount,
        0
      ) ?? 0,
    address,
  }
}
export const getRewardReportQuery = createQuery({
  key: 'getRewardReport',
  fetcher: getRewardReport,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_TODAY_SUPER_LIKE_COUNT = gql`
  query GetTodaySuperLikeCount($address: String!, $day: Int!) {
    activeStakingDailyStatsByStaker(
      args: { address: $address, dayTimestamp: $day }
    ) {
      superLikesCount
    }
  }
`
export async function getTodaySuperLikeCount(
  address: string
): Promise<{ count: number }> {
  const res = await datahubQueryRequest<
    GetTodaySuperLikeCountQuery,
    GetTodaySuperLikeCountQueryVariables
  >({
    document: GET_TODAY_SUPER_LIKE_COUNT,
    variables: { address, ...getDayAndWeekTimestamp() },
  })
  return {
    count: res.activeStakingDailyStatsByStaker.superLikesCount,
  }
}
export const getTodaySuperLikeCountQuery = createQuery({
  key: 'getTodaySuperLikeCount',
  fetcher: getTodaySuperLikeCount,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

export type RewardHistory = {
  address: string
  rewards: {
    week: number
    startDate: string
    endDate: string
    reward: string
    creatorReward: string
  }[]
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
export const getRewardHistoryQuery = createQuery({
  key: 'getRewardHistory',
  fetcher: getRewardHistory,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_USER_YESTERDAY_REWARD = gql`
  query GetUserYesterdayReward($address: String!, $timestamp: String!) {
    activeStakingAccountActivityMetricsForFixedPeriod(
      args: {
        address: $address
        period: DAY
        periodValue: $timestamp
        staker: { likedPosts: true, earnedPointsByPeriod: true }
        creator: { earnedPointsByPeriod: true }
      }
    ) {
      creator {
        earnedPointsByPeriod
      }
      staker {
        likedPosts
        earnedPointsByPeriod
      }
    }
  }
`
async function getUserYesterdayReward({ address }: { address: string }) {
  const yesterday = dayjs.utc().subtract(1, 'day')
  const { day } = getDayAndWeekTimestamp(yesterday.toDate())

  const res = await datahubQueryRequest<
    GetUserYesterdayRewardQuery,
    GetUserYesterdayRewardQueryVariables
  >({
    document: GET_USER_YESTERDAY_REWARD,
    variables: {
      address,
      timestamp: day.toString(),
    },
  })
  const data = res.activeStakingAccountActivityMetricsForFixedPeriod

  return {
    address,
    earned: {
      creator: data.creator?.earnedPointsByPeriod ?? '0',
      staker: data.staker?.earnedPointsByPeriod ?? '0',
    },
    likedPosts: data.staker?.likedPosts,
  }
}
export const getUserYesterdayRewardQuery = createQuery({
  key: 'getUserYesterdayReward',
  fetcher: getUserYesterdayReward,
  defaultConfigGenerator: (param) => ({
    enabled: !!param?.address,
  }),
})

export const GET_DAILY_REWARD = gql`
  query GetDailyReward($address: String!) {
    gamificationEntranceDailyRewardSequence(
      args: { where: { address: $address } }
    ) {
      claimsCount
      claims {
        index
        openToClaim
        claimRewardPoints
        claimRewardPointsRange
        claimValidDay
        hiddenClaimReward
      }
    }
  }
`
async function getDailyReward(address: string) {
  const res = await datahubQueryRequest<
    GetDailyRewardQuery,
    GetDailyRewardQueryVariables
  >({
    document: GET_DAILY_REWARD,
    variables: { address },
  })
  return res.gamificationEntranceDailyRewardSequence
}
export const getDailyRewardQuery = createQuery({
  key: 'getDailyReward',
  fetcher: getDailyReward,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

export const GET_TOKENOMICS_METADATA = gql`
  query GetTokenomicsMetadata {
    activeStakingTokenomicMetadata {
      maxTapsPerDay
      superLikeWeightPoints
      likerRewardDistributionPercent
    }
  }
`
// NOTE: need to be careful when changing the structure of these cached data, because it can cause the app to crash if you access unavailable data
const getTokenomicsMetadataCache = new LocalStorage(
  () => 'tokenomics-metadata-cache'
)
export async function getTokenomicsMetadata() {
  const res = await datahubQueryRequest<
    GetTokenomicsMetadataQuery,
    GetTokenomicsMetadataQueryVariables
  >({
    document: GET_TOKENOMICS_METADATA,
  })
  getTokenomicsMetadataCache.set(
    JSON.stringify(res.activeStakingTokenomicMetadata)
  )
  return res.activeStakingTokenomicMetadata
}
export const getTokenomicsMetadataQuery = createQuery({
  key: 'getTokenomicsMetadata',
  fetcher: getTokenomicsMetadata,
  defaultConfigGenerator: () => {
    const cache = getTokenomicsMetadataCache.get()
    return {
      placeholderData:
        parseJSONData<Awaited<ReturnType<typeof getTokenomicsMetadata>>>(cache),
    }
  },
})
