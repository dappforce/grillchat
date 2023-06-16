import { gql } from 'graphql-request'

export const SPACE_FRAGMENT = gql`
  fragment SpaceFragment on Space {
    canEveryoneCreatePosts
    canFollowerCreatePosts
    content
    createdAtBlock
    createdAtTime
    createdByAccount {
      id
    }
    email
    name
    summary
    isShowMore
    linksOriginal
    hidden
    id
    updatedAtTime
    postsCount
    image
    tagsOriginal
    about
    ownedByAccount {
      id
    }
  }
`

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
    downvotesCount
    hidden
    id
    isComment
    kind
    repliesCount
    sharesCount
    upvotesCount
    updatedAtTime
    inReplyToKind
    inReplyToPost {
      id
    }
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
    }
    sharedPost {
      id
    }
    extensions {
      amount
      chain
      collectionId
      decimals
      extensionSchemaId
      id
      nftId
      token
      txHash
      url
      fromEvm {
        id
      }
      toEvm {
        id
      }
    }
  }
`
