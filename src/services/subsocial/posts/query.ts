import { getLinkedChatIdsForHubId } from '@/constants/hubs'
import { followedIdsStorage } from '@/stores/my-account'
import { createQuery, poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { getHubIds } from '@/utils/env/client'
import { gql } from 'graphql-request'
import { POST_FRAGMENT } from '../squid/fragments'
import {
  GetOwnedPostIdsQuery,
  GetOwnedPostIdsQueryVariables,
  GetPostsByContentQuery,
  GetPostsByContentQueryVariables,
} from '../squid/generated'
import { mapPostFragment } from '../squid/mappers'
import { squidRequest } from '../squid/utils'

const getPostIdsBySpaceId = poolQuery<
  SubsocialQueryData<string>,
  { spaceId: string; postIds: string[] }
>({
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    const [{ api }] = allParams
    const spaceIds = allParams.map(({ data }) => data).filter((id) => !!id)
    if (spaceIds.length === 0) return []

    const res = await Promise.all(
      spaceIds.map((spaceId) => api.blockchain.postIdsBySpaceId(spaceId))
    )
    return res.map((postIds, i) => ({
      spaceId: spaceIds[i],
      postIds,
    }))
  },
  resultMapper: {
    paramToKey: (param) => param.data,
    resultToKey: (result) => result?.spaceId ?? '',
  },
})
export const getPostIdsBySpaceIdQuery = createSubsocialQuery({
  key: 'postIdsBySpaceId',
  fetcher: getPostIdsBySpaceId,
})

async function getFollowedPostIdsByAddress({
  api,
  data: address,
}: SubsocialQueryData<string>) {
  if (!address) return []

  const substrateApi = await api.substrateApi
  const rawFollowedPosts =
    await substrateApi.query.postFollows.postsFollowedByAccount(address)
  const followedPostIdsNumber = rawFollowedPosts.toPrimitive() as number[]
  const followedPostIds = followedPostIdsNumber.map((id) => id.toString())

  followedIdsStorage.set(JSON.stringify(followedPostIds), address)
  return followedPostIds
}
export const getFollowedPostIdsByAddressQuery = createSubsocialQuery({
  key: 'followedPostIdsByAddress',
  fetcher: getFollowedPostIdsByAddress,
  defaultConfigGenerator: (address) => {
    if (!address) return {}

    const placeholderData = followedIdsStorage.get(address)
    if (!placeholderData) return {}

    try {
      const parsedData = JSON.parse(placeholderData)
      if (
        !Array.isArray(parsedData) ||
        !parsedData.every((id) => typeof id === 'string')
      )
        throw new Error('Invalid data')
      return {
        placeholderData: parsedData as string[],
      }
    } catch {
      return {}
    }
  },
})

export const GET_POSTS_BY_CONTENT = gql`
  ${POST_FRAGMENT}
  query GetPostsByContent(
    $search: String!
    $spaceIds: [String!]!
    $postIds: [String!]!
  ) {
    posts(
      where: {
        AND: [
          { hidden_eq: false, isComment_eq: false }
          {
            title_containsInsensitive: $search
            OR: { body_containsInsensitive: $search }
          }
          { space: { id_in: $spaceIds }, OR: { id_in: $postIds } }
        ]
      }
    ) {
      ...PostFragment
    }
  }
`
async function getPostsByContent(search: string) {
  if (!search) return []

  const linkedPostIds = new Set<string>()
  const hubIds = getHubIds()
  hubIds.forEach((hubId) => {
    const linkedChatIds = getLinkedChatIdsForHubId(hubId)
    linkedChatIds.forEach((chatId) => linkedPostIds.add(chatId))
  })

  const res = await squidRequest<
    GetPostsByContentQuery,
    GetPostsByContentQueryVariables
  >({
    document: GET_POSTS_BY_CONTENT,
    variables: {
      search,
      spaceIds: getHubIds(),
      postIds: Array.from(linkedPostIds.values()),
    },
  })
  return res.posts.map((post) => mapPostFragment(post))
}
export const getPostsBySpaceContentQuery = createQuery({
  key: 'postsBySpaceContent',
  fetcher: getPostsByContent,
})

export const GET_OWNED_POST_IDS = gql`
  query GetOwnedPostIds($address: String!) {
    posts(where: { ownedByAccount: { id_eq: $address }, isComment_eq: false }) {
      id
    }
  }
`
async function getOwnedPostIds(address: string) {
  if (!address) return []

  const res = await squidRequest<
    GetOwnedPostIdsQuery,
    GetOwnedPostIdsQueryVariables
  >({
    document: GET_OWNED_POST_IDS,
    variables: { address },
  })
  return res.posts.map(({ id }) => id)
}
export const getOwnedPostIdsQuery = createQuery({
  key: 'ownedPostIds',
  fetcher: getOwnedPostIds,
})
