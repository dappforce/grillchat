import { HeadConfigProps } from '@/components/HeadConfig'
import { getHubIdFromAlias } from '@/constants/config'
import MessageRedirectPage, {
  MessageRedirectPageProps,
} from '@/modules/chat/MessageRedirectPage'
import { AppCommonProps } from '@/pages/_app'
import { getNftDataServer } from '@/pages/api/nft'
import { getPostsServer } from '@/pages/api/posts'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPostQuery } from '@/services/api/query'
import { ResourceTypes } from '@/services/datahub/moderation/utils'
import { isMessageBlocked } from '@/utils/chat'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { PostContentExtension } from '@subsocial/api/types'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

type ExtensionData = { image: string | undefined | null }
async function getMessageDataFromExtension(
  extensions?: PostContentExtension[]
): Promise<ExtensionData> {
  if (!extensions) return { image: null }

  const firstExtension = extensions[0]
  switch (firstExtension.id) {
    case 'subsocial-image':
      return { image: firstExtension.properties.image }
    case 'subsocial-evm-nft':
      const nftData = await getNftDataServer(firstExtension.properties)
      return { image: nftData?.image }
  }

  return { image: null }
}

export const getStaticProps = getCommonStaticProps<
  MessageRedirectPageProps & AppCommonProps
>(
  () => ({}),
  async (context) => {
    const hubIdOrAlias = context.params?.hubId as string
    let messageId = context.params?.messageId as string
    const slug = context.params?.slug as string

    const chatId = getIdFromSlug(slug)
    const hubId = getHubIdFromAlias(hubIdOrAlias) || hubIdOrAlias
    if (!messageId || !chatId) return undefined

    let title = ''
    let description = ''
    let image = ''
    let cardFormat: HeadConfigProps['cardFormat'] = 'summary'

    const queryClient = new QueryClient()

    try {
      const results = await getPostsServer([chatId, messageId])
      const chat = results.find((post) => post.id === chatId)
      const message = results.find((post) => post.id === messageId)

      const ownerId = message?.struct.ownerId
      messageId = message?.id ?? messageId

      const extensionData = await getMessageDataFromExtension(
        message?.content?.extensions
      )
      const originalHubId = chat?.struct.spaceId
      const hubIds = [hubId]
      if (originalHubId && originalHubId !== hubId) {
        hubIds.push(originalHubId)
      }

      const chatEntityId = chat?.entityId ?? ''
      const blockedEntities = await prefetchBlockedEntities(
        queryClient,
        hubIds,
        [chatEntityId]
      )
      const appBlockedEntities = getFlatModeratedResource(
        blockedEntities?.blockedInAppIds
      )
      const hubBlockedEntities = getFlatModeratedResource(
        blockedEntities?.blockedInSpaceIds
      )
      const chatBlockedEntities = getFlatModeratedResource(
        blockedEntities?.blockedInPostIds
      )

      const isBlocked = isMessageBlocked(message, {
        addresses: new Set([
          ...appBlockedEntities.address,
          ...hubBlockedEntities.address,
          ...chatBlockedEntities.address,
        ]),
        contentIds: new Set([
          ...appBlockedEntities.cid,
          ...hubBlockedEntities.cid,
          ...chatBlockedEntities.cid,
        ]),
        postIds: new Set([
          ...appBlockedEntities.postId,
          ...hubBlockedEntities.postId,
          ...chatBlockedEntities.postId,
        ]),
      })

      if (!chat?.struct.hidden && !isBlocked) {
        title = `Message from ${chat?.content?.title}`
        description = message?.content?.body ?? ''
        const imageMaybeCid = extensionData.image ?? chat?.content?.image
        if (imageMaybeCid) {
          image = imageMaybeCid ? getIpfsContentUrl(imageMaybeCid) : ''
          cardFormat = 'summary_large_image'
        }
      }

      results.forEach((post) => {
        getPostQuery.setQueryData(queryClient, post.id, post)
      })
    } catch (err) {
      console.error('Error fetching for message page: ', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        head: {
          title,
          description,
          image,
          cardFormat,
        },
        messageId,
        chatId,
        hubId,
      },
      revalidate: 2,
    }
  }
)

function getFlatModeratedResource(
  data?: {
    id: string
    blockedResources: Record<ResourceTypes, string[]>
  }[]
): Record<ResourceTypes, string[]> {
  if (!data) return { address: [], postId: [], cid: [] }
  return {
    address: data
      .map(({ blockedResources }) => blockedResources.address)
      .flat(),
    postId: data.map(({ blockedResources }) => blockedResources.postId).flat(),
    cid: data.map(({ blockedResources }) => blockedResources.cid).flat(),
  }
}

export default MessageRedirectPage
