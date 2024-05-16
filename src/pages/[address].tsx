import HomePage from '@/modules/chat/HomePage'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPaginatedPostIdsByPostId } from '@/services/datahub/posts/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { AppCommonProps } from './_app'

export const getStaticPaths = async () => {
  // Skip pre-rendering, because it will cause slow build time
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({
    head: {
      title: 'EPIC - A Meme-to-Earn Platform',
      description: 'Earn meme coins 💰 by posting and liking memes 🤣',
    },
  }),
  async (context) => {
    const client = new QueryClient()

    let { address } = context.params ?? {}
    if (!address) return undefined

    const addressString = address as string
    await Promise.all([
      getPaginatedPostIdsByPostId.fetchFirstPageQuery(
        client,
        '0x3b1bf91da3fd7e5d790c19039110a5a7',
        1
      ),
      prefetchBlockedEntities(
        client,
        ['0xc75507f88e6a7d555c15ac95c49cb426'],
        ['0x3b1bf91da3fd7e5d790c19039110a5a7']
      ),
    ])
    getPaginatedPostIdsByPostId.invalidateFirstQuery(
      client,
      '0x3b1bf91da3fd7e5d790c19039110a5a7'
    )

    return {
      revalidate: 5,
      props: {
        dehydratedState: dehydrate(client),
        address: addressString,
      },
    }
  }
)

export default HomePage
