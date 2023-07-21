import MessageRedirectPage from '@/modules/chat/MessageRedirectPage'
import { getPostsServer } from '@/pages/api/posts'
import { AppCommonProps } from '@/pages/_app'
import { getNftQuery } from '@/services/api/query'
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
      const nftData = await getNftQuery.fetchQuery(
        null,
        firstExtension.properties
      )
      return { image: nftData?.image }
  }

  return { image: null }
}

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({}),
  async (context) => {
    const messageId = context.params?.messageId as string | undefined
    const slug = context.params?.slug as string
    const chatId = getIdFromSlug(slug)
    if (!messageId || !chatId) return undefined

    let title = ''
    let description = ''
    let image = ''

    try {
      const results = await getPostsServer([chatId, messageId])
      const chat = results.find((post) => post.id === chatId)
      const message = results.find((post) => post.id === messageId)

      const extensionData = await getMessageDataFromExtension(
        message?.content?.extensions
      )

      if (!chat?.struct.hidden) {
        title = `Message from ${chat?.content?.title}`
        description = message?.content?.body ?? ''
        const imageMaybeCid = extensionData.image ?? chat?.content?.image
        image = imageMaybeCid ? getIpfsContentUrl(imageMaybeCid) : ''
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
        },
      },
      revalidate: 2,
    }
  }
)

export default MessageRedirectPage
