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

export const DATAHUB_POST_FRAGMENT = gql`
  fragment DatahubPostFragment on Post {
    id
    createdAtTime
    createdByAccount {
      id
    }
    space {
      id
    }
    title
    body
    approvedInRootPost
    ownedByAccount {
      id
    }
    rootPost {
      persistentId
      space {
        id
      }
    }
    extensions {
      image
      extensionSchemaId
    }
  }
`

const GET_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetPosts($ids: [String!], $pageSize: Int!) {
    posts(args: { filter: { persistentIds: $ids }, pageSize: $pageSize }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`

const GET_OPTIMISTIC_POSTS = gql`
  ${DATAHUB_POST_FRAGMENT}
  query GetOptimisticPosts($ids: [String!]) {
    posts(args: { filter: { ids: $ids } }) {
      data {
        ...DatahubPostFragment
      }
    }
  }
`

export function isPersistentId(id: string) {
  return !isNaN(+id) && !id.startsWith('0x')
}

export async function getPosts(postIds: string[]) {
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
    const [datahubResPromise] = await Promise.allSettled([
      datahubQueryRequest<GetPostsQuery, GetPostsQueryVariables>({
        document: GET_POSTS,
        variables: { ids: persistentIds, pageSize: persistentIds.length },
      }),
    ] as const)
    if (datahubResPromise.status !== 'fulfilled') {
      throw new Error(datahubResPromise.reason)
    }
    persistentPosts = datahubResPromise.value.posts.data.map((post) => {
      return {
        ...mapDatahubPostFragment(post),
        requestedId: post.id ?? undefined,
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
    optimisticPosts = res.posts.data.map((post) => {
      return { ...mapDatahubPostFragment(post), requestedId: post.id }
    })
  }

  return [...persistentPosts, ...optimisticPosts]
}
