import { env } from '@/env.mjs'
import StubChatPage from '@/modules/chat/ChatPage/StubChatPage'
import { GetPostsQuery } from '@/services/datahub/generated-query'
import { datahubQueryRequest } from '@/services/datahub/utils'
import { getCommonServerSideProps } from '@/utils/page'
import { gql } from 'graphql-request'

const GET_POSTS = gql`
  query GetPosts($resource: String!, $spaceId: String!) {
    posts(args: { filter: { resource: $resource, spaceId: $spaceId } }) {
      data {
        id
      }
    }
  }
`

const getPostIdByResourceId = async (resourceId: string, spaceId: string) => {
  const posts = await datahubQueryRequest<
    GetPostsQuery,
    { resource: string; spaceId: string }
  >({
    document: GET_POSTS,
    variables: { resource: resourceId, spaceId: spaceId },
  })

  return posts?.posts?.data?.[0]?.id
}

export const getServerSideProps = getCommonServerSideProps(
  {},
  async (context) => {
    context.res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate')
    const { resourceId } = context.params || {}

    const hubId = env.NEXT_PUBLIC_RESOURCES_ID

    if (!hubId || !resourceId) {
      return undefined
    }

    // TODO: get linked resource from resourceId
    const linkedResource = await getPostIdByResourceId(
      resourceId as string,
      hubId
    )

    console.log(linkedResource)
    if (!linkedResource) {
      return {
        props: {},
      }
    }

    const queryParams = context.req.url?.split('?')?.[1] ?? ''
    return {
      redirect: {
        destination: `/${hubId}/${linkedResource}`,
        permanent: false,
      },
    }
  }
)

export default StubChatPage
