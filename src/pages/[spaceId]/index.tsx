import {
  getLinkedPostIdsForSpaceId,
  getSpaceIdFromTopic,
  getTopicFromSpaceId,
} from '@/constants/chat-room'
import HomePage from '@/modules/_[spaceId]/HomePage'
import { HomePageProps } from '@/modules/_[spaceId]/HomePage/HomePage'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getMainSpaceId, getSpaceIds } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { prefetchBlockedEntities } from '@/utils/server'
import { isValidNumber } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getPostsFromCache } from '../api/posts'

export const getStaticPaths = async () => {
  const spaceIds = getSpaceIds()

  const paths = spaceIds.map<{ params: { spaceId: string } }>((spaceId) => {
    const topic = getTopicFromSpaceId(spaceId)
    return {
      params: { spaceId: topic || spaceId },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

function getSpaceIdFromParam(paramSpaceId: string) {
  const spaceIdOrTopic = paramSpaceId ?? getMainSpaceId()
  let spaceId = spaceIdOrTopic
  if (!isValidNumber(spaceIdOrTopic)) {
    const spaceIdFromTopic = getSpaceIdFromTopic(spaceIdOrTopic)
    if (spaceIdFromTopic) {
      spaceId = spaceIdFromTopic
    } else {
      return undefined
    }
  }
  return spaceId
}

async function getLastPosts(commentIdsByPostId: string[][]) {
  const lastPostIds = commentIdsByPostId
    .map((ids) => ids[ids.length - 1])
    .filter((id) => !!id)

  let lastPosts: PostData[] = []
  if (lastPostIds.length > 0) {
    lastPosts = await getPostsFromCache(lastPostIds)
  }
  return lastPosts
}
async function getPostsData(postIds: string[]) {
  const subsocialApi = await getSubsocialApi()

  const [commentIdsByPostId, posts] = await Promise.all([
    Promise.all(
      postIds.map((postId) => {
        return subsocialApi.blockchain.getReplyIdsByPostId(postId)
      })
    ),
    getPostsFromCache(postIds),
  ] as const)

  const lastPosts = await getLastPosts(commentIdsByPostId)

  return { posts, lastPosts, commentIdsByPostId }
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
    const spaceId = getSpaceIdFromParam(paramSpaceId as string)
    if (!spaceId) return undefined

    try {
      const subsocialApi = await getSubsocialApi()
      const postIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
      const allPostIds = [...postIds, ...getLinkedPostIdsForSpaceId(spaceId)]

      const [{ lastPosts, posts, commentIdsByPostId }] = await Promise.all([
        getPostsData(allPostIds),
        prefetchBlockedEntities(queryClient, allPostIds),
      ] as const)

      getPostIdsBySpaceIdQuery.setQueryData(queryClient, spaceId, {
        spaceId,
        postIds,
      })
      commentIdsByPostId.forEach((commentIds, idx) => {
        queryClient.setQueryData(
          getCommentIdsQueryKey(allPostIds[idx]),
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
      },
      revalidate: 2,
    }
  }
)
export default HomePage
