import { followedIdsStorage } from '@/stores/my-account'
import { createQuery, poolQuery } from '@/subsocial-query'
import { createSubsocialQuery } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import { getPostIdsBySpaceIds } from './fetcher'

const getPostIdsBySpaceId = poolQuery<
  string,
  { spaceId: string; postIds: string[] }
>({
  name: 'getPostIdsBySpaceId',
  multiCall: async (allParams) => {
    if (allParams.length === 0) return []
    return getPostIdsBySpaceIds(allParams)
  },
  resultMapper: {
    paramToKey: (param) => param,
    resultToKey: (result) => result?.spaceId ?? '',
  },
})
export const getPostIdsBySpaceIdQuery = createQuery({
  key: 'postIdsBySpaceId',
  fetcher: getPostIdsBySpaceId,
})

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

// TODO: change impl to datahub
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
