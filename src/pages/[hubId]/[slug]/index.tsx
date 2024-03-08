import { CHAT_PER_PAGE } from '@/constants/chat'
import { getHubIdFromAlias } from '@/constants/config'
import ChatPage, { ChatPageProps } from '@/modules/chat/ChatPage'
import { AppCommonProps } from '@/pages/_app'
import { getAccountsDataFromCache } from '@/pages/api/accounts-data'
import { getPostsServer } from '@/pages/api/posts'
import { getPricesFromCache } from '@/pages/api/prices'
import { getProfilesServer } from '@/pages/api/profiles'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPostQuery, getProfileQuery } from '@/services/api/query'
import { getSuperLikeCountQuery } from '@/services/datahub/content-staking/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import {
  getPaginatedPostsByPostIdFromDatahubQuery,
  getPostMetadataQuery,
} from '@/services/datahub/posts/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { getCommentIdsByPostIdFromChainQuery } from '@/services/subsocial/commentIds'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { removeUndefinedValues } from '@/utils/general'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { validateNumber } from '@/utils/strings'
import { QueryClient, dehydrate } from '@tanstack/react-query'
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

  const [accountsDataPromise, profilesPromise, prices] =
    await Promise.allSettled([
      getAccountsDataFromCache(chatPageOwnerIds, 'GET'),
      getProfilesServer(chatPageOwnerIds),
      getPricesFromCache(Object.values(coingeckoTokenIds)),
      ...chatPageOwnerIds.map((ownerId) =>
        getLinkedIdentityQuery.fetchQuery(client, ownerId)
      ),
    ] as const)
  if (accountsDataPromise.status === 'fulfilled') {
    accountsDataPromise.value.forEach((accountAddresses) => {
      getAccountDataQuery.setQueryData(
        client,
        accountAddresses.grillAddress,
        accountAddresses
      )
    })
  }
  if (profilesPromise.status === 'fulfilled') {
    profilesPromise.value.forEach((profile) => {
      getProfileQuery.setQueryData(
        client,
        profile.address,
        removeUndefinedValues(profile)
      )
    })
  }

  return {
    messages,
    messageIds,
    prices: prices.status === 'fulfilled' ? prices.value : [],
  }
}

async function getMessageIds(client: QueryClient, postId: string) {
  return isDatahubAvailable
    ? getMessageIdsFromDatahub(client, postId)
    : getMessageIdsFromChain(client, postId)
}

async function getMessageIdsFromDatahub(client: QueryClient, chatId: string) {
  const res =
    await getPaginatedPostsByPostIdFromDatahubQuery.fetchFirstPageQuery(
      client,
      chatId
    )

  const [messages] = await Promise.allSettled([
    getPostsServer(res.data),
    getSuperLikeCountQuery.fetchQueries(client, res.data),
  ] as const)
  if (messages.status === 'fulfilled') {
    messages.value.forEach((message) => {
      getPostQuery.setQueryData(client, message.id, message)
    })
  }

  getPaginatedPostsByPostIdFromDatahubQuery.invalidateFirstQuery(client, chatId)

  return {
    messageIds: res.data,
    messages: messages.status === 'fulfilled' ? messages.value : [],
  }
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

async function prefetchPostMetadata(queryClient: QueryClient, chatId: string) {
  if (isDatahubAvailable) {
    await getPostMetadataQuery.fetchQuery(queryClient, chatId)
  } else {
    await getCommentIdsByPostIdFromChainQuery.fetchQuery(queryClient, chatId)
  }
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
      getPostQuery.setQueryData(queryClient, chatId, chatData)

      const originalHubId = chatData.struct.spaceId
      const hubIds = [hubId]
      if (originalHubId && originalHubId !== hubId) {
        hubIds.push(originalHubId)
      }

      const chatEntityId = chatData.entityId ?? ''
      const [chatsPromise, blockedDataPromise] = await Promise.allSettled([
        getChatsData(queryClient, chatId),
        prefetchBlockedEntities(queryClient, hubIds, [chatEntityId]),
        prefetchPostMetadata(queryClient, chatId),
      ] as const)

      if (
        blockedDataPromise.status === 'fulfilled' &&
        blockedDataPromise.value
      ) {
        const blockedData = blockedDataPromise.value
        let isChatModerated = false
        ;[
          ...blockedData.blockedInSpaceIds,
          ...blockedData.blockedInAppIds,
        ].forEach(({ blockedResources }) => {
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

      if (chatsPromise.status === 'fulfilled') {
        const prices = chatsPromise.value.prices
        prices.forEach((price) => {
          const { id, current_price } = price || {}

          if (id && current_price) {
            getPriceQuery.setQueryData(queryClient, id, {
              id,
              current_price: current_price?.toString(),
            })
          }
        })
      }
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
