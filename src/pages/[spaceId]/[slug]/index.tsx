import { CHAT_PER_PAGE } from '@/constants/chat'
import { getSpaceIdFromAlias } from '@/constants/chat-room'
import ChatPage, { ChatPageProps } from '@/modules/chat/ChatPage'
import { getAccountsDataFromCache } from '@/pages/api/accounts-data'
import { getPostsFromCache } from '@/pages/api/posts'
import { getPricesFromCache } from '@/pages/api/prices'
import { AppCommonProps } from '@/pages/_app'
import { prefetchBlockedEntities } from '@/server/moderation'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsQueryKey } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { coingeckoTokenIds } from '@/services/subsocial/prices/query'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { validateNumber } from '@/utils/strings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'
import { getPriceQuery } from '../../../services/subsocial/prices/query'

export const getStaticPaths: GetStaticPaths = async () => {
  // For chats page, skip pre-rendering, because it will cause super slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

function getValidatedChatId(slugParam: string) {
  const chatId = getIdFromSlug(slugParam)
  if (!chatId || !validateNumber(chatId)) return undefined

  return chatId
}

async function getChatsData(chatId: string) {
  const [chatData] = await getPostsFromCache([chatId])

  const subsocialApi = await getSubsocialApi()
  const messageIds = await subsocialApi.blockchain.getReplyIdsByPostId(chatId)

  const preloadedPostCount = CHAT_PER_PAGE * 2
  const startSlice = Math.max(0, messageIds.length - preloadedPostCount)
  const endSlice = messageIds.length
  const prefetchedMessageIds = messageIds.slice(startSlice, endSlice)
  const messages = await getPostsFromCache(prefetchedMessageIds)

  const owners = messages.map((message) => message.struct.ownerId)

  const ownersSet = new Set(owners)
  const chatPageOwnerIds = Array.from(ownersSet).slice(0, CHAT_PER_PAGE)

  const prices = await getPricesFromCache(Object.values(coingeckoTokenIds))

  const accountsAddresses = await getAccountsDataFromCache(chatPageOwnerIds)

  return { messages, chatData, messageIds, accountsAddresses, prices }
}

export const getStaticProps = getCommonStaticProps<
  ChatPageProps & AppCommonProps
>(
  () => ({
    head: { disableZoom: true },
  }),
  async (context) => {
    const spaceIdOrAlias = context.params?.spaceId as string
    const slugParam = context.params?.slug as string
    const chatId = getValidatedChatId(slugParam)
    if (!chatId) return undefined

    const spaceId = getSpaceIdFromAlias(spaceIdOrAlias) || spaceIdOrAlias

    const queryClient = new QueryClient()

    let title: string | null = null
    let desc: string | null = null
    try {
      const [{ messageIds, messages, chatData, accountsAddresses, prices }] =
        await Promise.all([
          getChatsData(chatId),
          prefetchBlockedEntities(queryClient, spaceId, [chatId]),
        ] as const)

      title = chatData?.content?.title || null
      desc = chatData?.content?.body || null

      getPostQuery.setQueryData(queryClient, chatId, chatData)
      queryClient.setQueryData(
        getCommentIdsQueryKey(chatId),
        messageIds ?? null
      )

      messages.forEach((post) => {
        getPostQuery.setQueryData(queryClient, post.id, post)
      })

      accountsAddresses.forEach((accountAddresses) =>
        getAccountDataQuery.setQueryData(
          queryClient,
          accountAddresses.evmAddress,
          accountAddresses
        )
      )
      prices.forEach((price) => {
        Array.isArray
        if (price) {
          getPriceQuery.setQueryData(queryClient, price.id, {
            id: price.id,
            current_price: price.current_price?.toString() || null,
          })
        }
      })
    } catch (err) {
      console.error('Error fetching for chat page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        chatId,
        hubId: spaceId,
        head: {
          title,
          description: desc,
        },
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
