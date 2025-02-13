import { datahubQueryRequest } from '@/services/datahub/utils'
import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'

const GET_FOLLOWED_POSTS_IDS = gql`
  query getFollowedPostIdsByAddress($address: String!) {
    postFollowers(args: { filter: { accountId: $address } }) {
      data {
        id
        dataType
        postKind
        followingPost {
          id
        }
      }
    }
  }
`

async function getFollowedPostIdsByAddress(address: string) {
  if (!address) return []

  const res = await datahubQueryRequest<
    { postFollowers: { data: { id: string }[] } },
    { address: string }
  >({
    document: GET_FOLLOWED_POSTS_IDS,
    variables: { address },
  })

  const data = res.postFollowers.data

  return data.map(({ id }) => id)
}

export const getFollowedPostIdsByAddressQuery = createQuery({
  key: 'followedPostIdsByAddress',
  fetcher: getFollowedPostIdsByAddress,
})

const GET_OWNED_POSTS_IDS = gql`
  query getOwnedPostIds($address: String!) {
    posts(
      args: {
        filter: { ownedByAccountAddress: $address, postKind: "RegularPost" }
      }
    ) {
      data {
        id
      }
    }
  }
`

const getOwnedPostIds = async (address: string) => {
  if (!address) return []

  const res = await datahubQueryRequest<
    { posts: { data: { id: string }[] } },
    { address: string }
  >({
    document: GET_OWNED_POSTS_IDS,
    variables: { address },
  })

  const data = res.posts.data

  return data.map(({ id }) => id)
}

export const getOwnedPostIdsQuery = createQuery({
  key: 'ownedPostIds',
  fetcher: getOwnedPostIds,
})
