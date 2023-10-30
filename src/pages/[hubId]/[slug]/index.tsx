import { CHAT_PER_PAGE } from '@/constants/chat'
import { getHubIdFromAlias } from '@/constants/hubs'
import ChatPage, { ChatPageProps } from '@/modules/chat/ChatPage'
import { getAccountsDataFromCache } from '@/pages/api/accounts-data'
import { getPostsServer } from '@/pages/api/posts'
import { getPricesFromCache } from '@/pages/api/prices'
import { AppCommonProps } from '@/pages/_app'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPostQuery } from '@/services/api/query'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import {
  getCommentIdsByPostIdFromDatahub,
  getPostMetadataQuery,
} from '@/services/subsocial/datahub/posts/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { getDatahubConfig } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { validateNumber } from '@/utils/strings'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

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

async function getChatsData(client: QueryClient, chatId: string) {
  const { messageIds, messages } = await getMessageIds(client, chatId)

  const owners = messages.map((message) => message.struct.ownerId)

  const ownersSet = new Set(owners)
  const chatPageOwnerIds = Array.from(ownersSet).slice(0, CHAT_PER_PAGE)

  const prices = await getPricesFromCache(Object.values(coingeckoTokenIds))

  const accountsAddresses = await getAccountsDataFromCache(
    chatPageOwnerIds,
    'GET'
  )

  return {
    messages,
    messageIds,
    accountsAddresses,
    prices,
  }
}

async function getMessageIds(client: QueryClient, postId: string) {
  return getDatahubConfig()
    ? getMessageIdsFromDatahub(client, postId)
    : getMessageIdsFromChain(client, postId)
}

async function getMessageIdsFromDatahub(client: QueryClient, chatId: string) {
  const res = await getCommentIdsByPostIdFromDatahub.fetchFirstPageQuery(
    client,
    chatId
  )
  getCommentIdsByPostIdFromDatahub.invalidateFirstQuery(client, chatId)

  return { messageIds: res.data, messages: res.messages }
}
async function getMessageIdsFromChain(client: QueryClient, chatId: string) {
  const messageIds = await getCommentIdsByPostIdFromChainQuery.fetchQuery(
    client,
    chatId
  )

  const preloadedPostCount = CHAT_PER_PAGE * 2
  const startSlice = Math.max(0, messageIds.length - preloadedPostCount)
  const endSlice = messageIds.length
  const prefetchedMessageIds = messageIds.slice(startSlice, endSlice)

  const messages = await getPostsServer(prefetchedMessageIds)
  messages.forEach((message) => {
    getPostQuery.setQueryData(client, message.id, message)
  })

  return { messageIds: prefetchedMessageIds, messages }
}

export const getStaticProps = getCommonStaticProps<
  ChatPageProps & AppCommonProps
>(
  () => ({
    head: { disableZoom: true },
  }),
  async (context) => {
    const hubIdOrAlias = context.params?.hubId as string
    const slugParam = context.params?.slug as string
    const chatId = getValidatedChatId(slugParam)
    if (!chatId) return undefined

    const hubId = getHubIdFromAlias(hubIdOrAlias) || hubIdOrAlias

    const queryClient = new QueryClient()

    let title: string | null = null
    let desc: string | null = null
    let image: string | null = null
    try {
      const [chatData] = await getPostsServer([chatId])
      const originalHubId = chatData.struct.spaceId
      const hubIds = [hubId]
      if (originalHubId && originalHubId !== hubId) {
        hubIds.push(originalHubId)
      }

      const [{ accountsAddresses, prices }, blockedData] = await Promise.all([
        getChatsData(queryClient, chatId),
        prefetchBlockedEntities(queryClient, hubIds, [chatId]),
      ] as const)

      if (blockedData) {
        let isChatModerated = false
        blockedData.blockedInSpaceIds.forEach(({ blockedResources }) => {
          if (blockedResources.postId.includes(chatId)) {
            isChatModerated = true
          }
        })
        if (isChatModerated)
          return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          }
      }

      if (!chatData.struct.hidden) {
        title = chatData?.content?.title || null
        desc = chatData?.content?.body || null

        const chatImage = chatData.content?.image
        image = chatImage ? getIpfsContentUrl(chatImage) : null
      }

      getPostMetadataQuery.fetchQuery(queryClient, chatId)
      getPostQuery.setQueryData(queryClient, chatId, chatData)

      accountsAddresses.forEach((accountAddresses) => {
        if (accountAddresses.evmAddress) {
          getAccountDataQuery.setQueryData(
            queryClient,
            accountAddresses.grillAddress,
            accountAddresses
          )
        }
      })
      prices.forEach((price) => {
        const { id, current_price } = price || {}

        if (id && current_price) {
          getPriceQuery.setQueryData(queryClient, id, {
            id,
            current_price: current_price?.toString(),
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
        hubId,
        head: {
          title,
          description: desc,
          image,
        },
      },
      revalidate: 2,
    }
  }
)

export default ChatPage
