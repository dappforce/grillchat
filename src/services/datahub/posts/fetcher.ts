import { PostData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import { getPostsFollowersCountFromSquid } from '../../subsocial/posts/fetcher'
import {
  GetOptimisticPostsQuery,
  GetOptimisticPostsQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'

export const DATAHUB_POST_FRAGMENT = gql`
  fragment DatahubPostFragment on Post {
    id
    optimisticId
    dataType
    content
    createdAtBlock
    createdAtTime
    createdByAccount {
      id
    }
    title
    body
    summary
    isShowMore
    image
    link
    hidden
    persistentId
    blockchainSyncFailed
    isComment
    kind
    updatedAtTime
    canonical
    tagsOriginal
    followersCount
    ownedByAccount {
      id
    }
    space {
      id
    }
    rootPost {
      persistentId
      space {
        id
      }
    }
    inReplyToKind
    inReplyToPost {
      persistentId
    }
    extensions {
      image
      amount
      chain
      collectionId
      decimals
      extensionSchemaId
      id
      nftId
      token
      txHash
      message
      recipient {
        id
      }
      nonce
      url
      fromEvm {
        id
      }
      toEvm {
        id
      }
      pinnedResources {
        post {
          id
          persistentId
        }
      }
    }
  }
`

const GET_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetPosts($ids: [String!], $pageSize: Int!) {
    findPosts(where: { persistentIds: $ids, pageSize: $pageSize }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`

const GET_OPTIMISTIC_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetOptimisticPosts($ids: [String!]) {
    findPosts(where: { ids: $ids }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`

export function isPersistentId(id: string) {
  return !isNaN(+id) && !id.startsWith('0x')
}

export async function getPostsFromDatahub(postIds: string[]) {
  if (postIds.length === 0) return []

  const persistentIds: string[] = []
  const entityIds: string[] = []
  postIds.forEach((id) => {
    if (!isPersistentId(id)) entityIds.push(id)
    else persistentIds.push(id)
  })

  let persistentPosts: PostData[] = []
  let optimisticPosts: PostData[] = []

  if (persistentIds.length > 0) {
    const [datahubResPromise, squidResPromise] = await Promise.allSettled([
      datahubQueryRequest<GetPostsQuery, GetPostsQueryVariables>({
        document: GET_POSTS,
        variables: { ids: persistentIds, pageSize: persistentIds.length },
      }),
      getPostsFollowersCountFromSquid(persistentIds),
    ] as const)
    const followersCountMap = new Map<string, number>()
    if (squidResPromise.status === 'fulfilled') {
      squidResPromise.value.forEach((post) => {
        followersCountMap.set(post.id, post.followersCount)
      })
    }
    if (datahubResPromise.status !== 'fulfilled') {
      throw new Error(datahubResPromise.reason)
    }
    persistentPosts = datahubResPromise.value.findPosts.data.map((post) => {
      post.followersCount = followersCountMap.get(post.persistentId ?? '') || 0
      return {
        ...mapDatahubPostFragment(post),
        requestedId: post.persistentId ?? undefined,
      }
    })
  }

  if (entityIds.length > 0) {
    const res = await datahubQueryRequest<
      GetOptimisticPostsQuery,
      GetOptimisticPostsQueryVariables
    >({
      document: GET_OPTIMISTIC_POSTS,
      variables: { ids: entityIds },
    })
    optimisticPosts = res.findPosts.data.map((post) => {
      return { ...mapDatahubPostFragment(post), requestedId: post.id }
    })
  }

  return [...persistentPosts, ...optimisticPosts]
}
