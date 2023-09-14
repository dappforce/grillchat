import { PostData } from '@subsocial/api/types'
import { gql } from 'graphql-request'
import {
  GetOptimisticPostsQuery,
  GetOptimisticPostsQueryVariables,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '../generated'
import { mapPostFragment } from '../mappers'
import { datahubRequest } from '../utils'
import { isOptimisticId } from './utils'

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
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
  ${POST_FRAGMENT}
  query GetPosts($ids: [String!]) {
    findPosts(where: { persistentIds: $ids }) {
      ...PostFragment
    }
  }
`

const GET_OPTIMISTIC_POSTS = gql`
  ${POST_FRAGMENT}
  query GetOptimisticPosts($ids: [String!]) {
    findPosts(where: { ids: $ids }) {
      ...PostFragment
    }
  }
`

export async function getPostsFromDatahub(postIds: string[]) {
  if (postIds.length === 0) return []

  const persistentIds: string[] = []
  const optimisticIds: string[] = []
  postIds.forEach((id) => {
    if (isOptimisticId(id)) optimisticIds.push(id)
    else persistentIds.push(id)
  })

  let persistentPosts: PostData[] = []
  let optimisticPosts: PostData[] = []

  if (persistentIds.length > 0) {
    const res = await datahubRequest<GetPostsQuery, GetPostsQueryVariables>({
      document: GET_POSTS,
      variables: { ids: persistentIds },
    })
    persistentPosts = res.findPosts.map((post) => {
      ;(post as any).id = post.persistentId || post.id
      return mapPostFragment(post as any)
    })
  }

  if (optimisticIds.length > 0) {
    const res = await datahubRequest<
      GetOptimisticPostsQuery,
      GetOptimisticPostsQueryVariables
    >({
      document: GET_OPTIMISTIC_POSTS,
      variables: { ids: optimisticIds },
    })
    optimisticPosts = res.findPosts.map((post) => {
      return mapPostFragment(post as any)
    })
  }

  return [...persistentPosts, ...optimisticPosts]
}
