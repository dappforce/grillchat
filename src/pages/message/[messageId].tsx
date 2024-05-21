import { HeadConfigProps } from '@/components/HeadConfig'
import { env } from '@/env.mjs'
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
    let messageId = context.params?.messageId as string

    if (!messageId) return undefined

    let title = ''
    let description = ''
    let image = ''
    let cardFormat: HeadConfigProps['cardFormat'] = 'summary'

    const queryClient = new QueryClient()

    try {
      const [message] = await getPostsServer([messageId])
      getPostQuery.setQueryData(queryClient, message.id, message)
      messageId = message?.id ?? messageId

      const extensionData = await getMessageDataFromExtension(
        message?.content?.extensions
      )

      const blockedEntities = await prefetchBlockedEntities(
        queryClient,
        [env.NEXT_PUBLIC_MAIN_SPACE_ID],
        [env.NEXT_PUBLIC_MAIN_CHAT_ID]
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

      if (!isBlocked) {
        title = `Message from Memes`
        description = message?.content?.body ?? ''
        const imageMaybeCid = extensionData.image
        if (imageMaybeCid) {
          image = imageMaybeCid ? getIpfsContentUrl(imageMaybeCid) : ''
          cardFormat = 'summary_large_image'
        }
      }
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
      },
      revalidate: 20,
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
