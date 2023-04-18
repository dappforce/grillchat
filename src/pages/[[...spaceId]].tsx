import HomePage from '@/modules/HomePage'
import { HomePageProps } from '@/modules/HomePage/HomePage'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getMainSpaceId, getSpaceIds } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { PostData } from '@subsocial/api/types'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getPostsFromCache } from './api/posts'

export const getStaticPaths = async () => {
  const spaceIds = getSpaceIds()

  // first space id is using / route
  const paths = spaceIds
    .slice(1)
    .map<{ params: { spaceId?: string[] | false } }>((spaceId) => ({
      params: { spaceId: [spaceId] },
    }))
  paths.push({ params: { spaceId: false } })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<
  {
    dehydratedState: any
  } & HomePageProps
>(
  () => ({}),
  async (context) => {
    const queryClient = new QueryClient()

    let { spaceId: paramSpaceId } = context.params ?? {}
    if (Array.isArray(paramSpaceId)) {
      if (paramSpaceId.length > 1) return undefined
      paramSpaceId = paramSpaceId[0]
    }
    const spaceId = paramSpaceId ?? getMainSpaceId()
    if (isNaN(parseInt(spaceId))) return undefined

    try {
      const subsocialApi = await getSubsocialApi()
      const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)

      const promises = postIds.map((postId) => {
        return subsocialApi.blockchain.getReplyIdsByPostId(postId)
      })
      const postsPromise = getPostsFromCache(postIds)

      const commentIdsByPostId = await Promise.all(promises)
      const posts = await postsPromise

      const lastPostIds = commentIdsByPostId
        .map((ids) => ids[ids.length - 1])
        .filter((id) => !!id)

      let lastPosts: PostData[] = []
      if (lastPostIds.length > 0) {
        lastPosts = await getPostsFromCache(lastPostIds)
      }

      getPostIdsBySpaceIdQuery.setQueryData(queryClient, spaceId, {
        spaceId,
        postIds,
      })
      commentIdsByPostId.forEach((commentIds, idx) => {
        queryClient.setQueryData(
          getCommentIdsQueryKey(postIds[idx]),
          commentIds ?? null
        )
      })
      ;[...lastPosts, ...posts].forEach((post) => {
        getPostQuery.setQueryData(
          queryClient,
          post.id,
          JSON.parse(JSON.stringify(post))
        )
      })
    } catch (e) {
      console.error('Error fetching for home page: ', e)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        isIntegrateChatButtonOnTop: Math.random() > 0.5,
        spaceId,
        isMainPage: !paramSpaceId,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
