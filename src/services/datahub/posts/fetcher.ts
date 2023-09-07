import { mapPostFragment } from '@/services/subsocial/squid/mappers'
import { gql } from 'graphql-request'
import { GetPostsQuery, GetPostsQueryVariables } from '../generated'
import { datahubRequest } from '../utils'

export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
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
    id
    isComment
    kind
    updatedAtTime
    inReplyToKind
    canonical
    tagsOriginal
    ownedByAccount {
      id
    }
    space {
      id
    }
    rootPost {
      id
      space {
        id
      }
    }
    sharedPost {
      id
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
  query getPosts($ids: [String!]) {
    findPosts(where: { ids: $ids }) {
      ...PostFragment
    }
  }
`

export async function getPostsFromDatahub(postIds: string[]) {
  if (postIds.length === 0) return []
  const res = await datahubRequest<GetPostsQuery, GetPostsQueryVariables>({
    document: GET_POSTS,
    variables: { ids: postIds },
  })
  return res.findPosts.map((post) => mapPostFragment(post as any))
}
