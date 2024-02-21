import { MINIMUM_LOCK } from '@/constants/subsocial'
import { ApiDatahubSuperLikeGetResponse } from '@/pages/api/datahub/super-like'
import { apiInstance } from '@/services/api/utils'
import { getSubIdRequest } from '@/services/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { AxiosResponse } from 'axios'
import { gql } from 'graphql-request'
import {
  GetAddressLikeCountToPostsQuery,
  GetAddressLikeCountToPostsQueryVariables,
  GetCanPostsSuperLikedQuery,
  GetCanPostsSuperLikedQueryVariables,
  GetPostRewardsQuery,
  GetPostRewardsQueryVariables,
  GetSuperLikeCountsQuery,
  GetSuperLikeCountsQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

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
      if (!item.persistentPostId) return
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
      persistentPostId
      rewardTotal
      draftRewardTotal
      rewardsBySource {
        fromDirectSuperLikes
        fromCommentSuperLikes
        fromShareSuperLikes
      }
      draftRewardsBySource {
        fromDirectSuperLikes
        fromCommentSuperLikes
        fromShareSuperLikes
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
    fromCommentSuperLikes: string
    fromShareSuperLikes: string
  }
}
const getPostRewards = poolQuery<string, PostRewards>({
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
        draftRewardsBySource,
        rewardsBySource,
        draftRewardTotal,
        rewardTotal,
      } = item
      const total = parseToBigInt(rewardTotal) + parseToBigInt(draftRewardTotal)
      if (!item.persistentPostId) return

      resultMap.set(item.persistentPostId, {
        postId: item.persistentPostId,
        reward: total.toString(),
        isNotZero: total > 0,
        rewardDetail: {
          draftReward: draftRewardTotal,
          finalizedReward: rewardTotal,
        },
        rewardsBySource: {
          fromCommentSuperLikes: (
            parseToBigInt(rewardsBySource?.fromCommentSuperLikes) +
            parseToBigInt(draftRewardsBySource?.fromCommentSuperLikes)
          ).toString(),
          fromDirectSuperLikes: (
            parseToBigInt(rewardsBySource?.fromDirectSuperLikes) +
            parseToBigInt(draftRewardsBySource?.fromDirectSuperLikes)
          ).toString(),
          fromShareSuperLikes: (
            parseToBigInt(rewardsBySource?.fromShareSuperLikes) +
            parseToBigInt(draftRewardsBySource?.fromShareSuperLikes)
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
            fromCommentSuperLikes: '0',
            fromDirectSuperLikes: '0',
            fromShareSuperLikes: '0',
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
