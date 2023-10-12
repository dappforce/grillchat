import { isOptimisticId } from '@/services/subsocial/utils'
import { PostData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import {
  GetOptimisticPostsQuery,
  GetOptimisticPostsQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '../generated-query'
import { mapDatahubPostFragment } from '../mappers'
import { datahubQueryRequest } from '../utils'

const DATAHUB_POST_FRAGMENT = gql`
  fragment DatahubPostFragment on Post {
    id
    optimisticId
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
    ownedByAccount {
      id
    }
    space {
      persistentId
    }
    rootPost {
      persistentId
      space {
        persistentId
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
        }
      }
    }
  }
`

const GET_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetPosts($ids: [String!]) {
    findPosts(where: { persistentIds: $ids }) {
      ...DatahubPostFragment
    }
  }
`

const GET_OPTIMISTIC_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetOptimisticPosts($ids: [String!]) {
    findPosts(where: { ids: $ids }) {
      ...DatahubPostFragment
    }
  }
`

export async function getPostsFromDatahub(postIds: string[]) {
  if (postIds.length === 0) return []

  const persistentIds: string[] = []
  const entityIds: string[] = []
  postIds.forEach((id) => {
    if (isOptimisticId(id)) entityIds.push(id)
    else persistentIds.push(id)
  })

  let persistentPosts: PostData[] = []
  let optimisticPosts: PostData[] = []

  if (persistentIds.length > 0) {
    const res = await datahubQueryRequest<
      GetPostsQuery,
      GetPostsQueryVariables
    >({
      document: GET_POSTS,
      variables: { ids: persistentIds },
    })
    persistentPosts = res.findPosts.map((post) => {
      ;(post as any).id = post.persistentId || post.id
      return mapDatahubPostFragment(post as any)
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
    optimisticPosts = res.findPosts.map((post) => {
      return mapDatahubPostFragment(post as any)
    })
  }

  return [...persistentPosts, ...optimisticPosts]
}
