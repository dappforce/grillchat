import { HeadConfigProps } from '@/components/HeadConfig'
import MessageRedirectPage, {
  MessageRedirectPageProps,
} from '@/modules/chat/MessageRedirectPage'
import { getNftDataServer } from '@/pages/api/nft'
import { getPostsServer } from '@/pages/api/posts'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getCommonStaticProps } from '@/utils/page'
import { getIdFromSlug } from '@/utils/slug'
import { PostContentExtension } from '@subsocial/api/types'
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

export const getStaticProps = getCommonStaticProps<MessageRedirectPageProps>(
  () => ({}),
  async (context) => {
    let messageId = context.params?.messageId as string
    const slug = context.params?.slug as string
    const chatId = getIdFromSlug(slug)
    if (!messageId || !chatId) return undefined

    let title = ''
    let description = ''
    let image = ''
    let cardFormat: HeadConfigProps['cardFormat'] = undefined

    try {
      const results = await getPostsServer([chatId, messageId])
      const chat = results.find((post) => post.id === chatId)
      const message = results.find((post) => post.id === messageId)
      messageId = message?.id ?? messageId

      const extensionData = await getMessageDataFromExtension(
        message?.content?.extensions
      )

      if (!chat?.struct.hidden) {
        title = `Message from ${chat?.content?.title}`
        description = message?.content?.body ?? ''
        const imageMaybeCid = extensionData.image ?? chat?.content?.image
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
        head: {
          title,
          description,
          image,
          cardFormat,
        },
        messageId,
      },
      revalidate: 2,
    }
  }
)

export default MessageRedirectPage
