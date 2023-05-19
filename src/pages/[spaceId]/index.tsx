import {
  getLinkedChatIdsForSpaceId,
  getSpaceIdFromAlias,
} from '@/constants/chat-room'
import HomePage, { HomePageProps } from '@/modules/chat/HomePage'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getMainSpaceId } from '@/utils/env/client'
import { getCommonStaticProps } from '@/utils/page'
import { prefetchBlockedEntities } from '@/utils/server'
import { isValidNumber } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { getPostsFromCache } from '../api/posts'
import { AppCommonProps } from '../_app'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function getSpaceIdFromParam(paramSpaceId: string) {
  const spaceIdOrAlias = paramSpaceId ?? getMainSpaceId()
  let spaceId = spaceIdOrAlias
  if (!isValidNumber(spaceIdOrAlias)) {
    const spaceIdFromAlias = getSpaceIdFromAlias(spaceIdOrAlias)
    if (spaceIdFromAlias) {
      spaceId = spaceIdFromAlias
    } else {
      return undefined
    }
  }
  return spaceId
}

async function getLastMessages(messageIdsByChatIds: string[][]) {
  const lastMessageIds = messageIdsByChatIds
    .map((ids) => ids[ids.length - 1])
    .filter((id) => !!id)

  let lastMessages: PostData[] = []
  if (lastMessageIds.length > 0) {
    lastMessages = await getPostsFromCache(lastMessageIds)
  }
  return lastMessages
}
async function getChatPreviewsData(chatIds: string[]) {
  const subsocialApi = await getSubsocialApi()

  const [messageIdsByChatIds, chats] = await Promise.all([
    Promise.all(
      chatIds.map((chatId) => {
        return subsocialApi.blockchain.getReplyIdsByPostId(chatId)
      })
    ),
    getPostsFromCache(chatIds),
  ] as const)

  const lastMessages = await getLastMessages(messageIdsByChatIds)

  return { chats, lastMessages, messageIdsByChatIds }
}

export const getStaticProps = getCommonStaticProps<
  HomePageProps & AppCommonProps
>(
  () => ({}),
  async (context) => {
    const queryClient = new QueryClient()

    let { spaceId: paramSpaceId } = context.params ?? {}
    const spaceId = getSpaceIdFromParam(paramSpaceId as string)
    if (!spaceId) return undefined

    try {
      const subsocialApi = await getSubsocialApi()

      const chatIds = await subsocialApi.blockchain.postIdsBySpaceId(spaceId)
      const allChatIds = [...chatIds, ...getLinkedChatIdsForSpaceId(spaceId)]

      const [{ lastMessages, chats, messageIdsByChatIds }] = await Promise.all([
        getChatPreviewsData(allChatIds),
        prefetchBlockedEntities(queryClient, allChatIds),
        getSpaceBySpaceIdQuery.fetchQuery(queryClient, spaceId),
      ] as const)

      getChatIdsBySpaceIdQuery.setQueryData(queryClient, spaceId, {
        spaceId,
        chatIds,
      })
      messageIdsByChatIds.forEach((messageIds, idx) => {
        queryClient.setQueryData(
          getCommentIdsQueryKey(allChatIds[idx]),
          messageIds ?? null
        )
      })
      ;[...lastMessages, ...chats].forEach((post) => {
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
        spaceId,
      },
      revalidate: 2,
    }
  }
)
export default HomePage
