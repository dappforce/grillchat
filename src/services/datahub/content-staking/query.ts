import { MINIMUM_LOCK } from '@/constants/subsocial'
import { getSubIdRequest } from '@/services/external'
import { createQuery, poolQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetAddressLikeCountToPostsQuery,
  GetAddressLikeCountToPostsQueryVariables,
  GetCanPostsSuperLikedQuery,
  GetCanPostsSuperLikedQueryVariables,
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
// This query is can only check one address at a time, this is currently not a problem because this query will mostly be used to fetch the like count of the current user
// If there will be other cases, this query should be updated to accept multiple addresses
const getAddressLikeCountToPosts = poolQuery<
  { postId: string; address: string },
  AddressLikeCountToPost
>({
  multiCall: async (params) => {
    if (!params.length) return []
    const address = params[0].address
    const postIds = params.map((param) => param.postId)

    const res = await datahubQueryRequest<
      GetAddressLikeCountToPostsQuery,
      GetAddressLikeCountToPostsQueryVariables
    >({
      document: GET_ADDRESS_LIKE_COUNT_TO_POSTS,
      variables: { postIds, address },
    })

    const resultMap = new Map<string, AddressLikeCountToPost>()
    res.activeStakingSuperLikeCountsByStaker.forEach((item) => {
      if (!item.persistentPostId) return
      resultMap.set(item.persistentPostId, {
        postId: item.persistentPostId,
        count: item.count,
        address,
      })
    })

    return postIds.map(
      (postId) => resultMap.get(postId) ?? { postId, count: 0, address }
    )
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
type CanPostSuperLiked = {
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
