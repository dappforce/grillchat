import { gql } from '@apollo/client'

export const GET_POST_BY_ID = gql`
  query Posts($where: PostWhereInput) {
    posts(where: $where) {
      body
      content
      createdAtTime
      experimental
      title
      summary
      slug
      space {
        name
        id
      }
      id
      createdByAccount {
        id
      }
    }
  }
`
