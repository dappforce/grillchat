import { useQuery } from '@apollo/client'
import { GET_POSTS_BY_SPACE_ID } from '../graphql/fragments/getPostsBySpaceId'

const useDiscoverVideosBySpace = () => {
  const {
    data: posts,
    loading: isPostsLoading,
    error: isPostsError,
  } = useQuery(GET_POSTS_BY_SPACE_ID, {
    variables: {
      where: {
        space: {
          id_eq: '11414',
        },
      },
    },
    pollInterval: 500,
  })

  return {
    posts,
    isPostsLoading,
    isPostsError,
  }
}

export default useDiscoverVideosBySpace
