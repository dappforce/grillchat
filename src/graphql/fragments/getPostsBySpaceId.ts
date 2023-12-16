import { gql } from '@apollo/client'

export const GET_POSTS_BY_SPACE_ID = gql`
  query GetPostBySpace($where: PostWhereInput) {
    posts(where: $where) {
      content
      experimental
      id
      image
      body
      title
      kind
      upvotesCount
      createdAtTime
      updatedAtTime
      createdByAccount {
        id
        profileSpace {
          about
          name
          image
        }
      }
      space {
        about
        id
        name
        postsCount
      }
    }
  }
`
