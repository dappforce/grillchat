import { env } from '@/env.mjs'
import MemesPage from '@/modules/telegram/MemesPage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPaginatedPostIdsByPostId } from '@/services/datahub/posts/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'

export const getStaticProps = getCommonStaticProps<AppCommonProps>(
  () => ({
    head: {
      title: 'EPIC - A Meme-to-Earn Platform',
      description: 'Earn meme coins 💰 by posting and liking memes 🤣',
      disableZoom: true,
    },
  }),
  async () => {
    const client = new QueryClient()
    await Promise.all([
      getPaginatedPostIdsByPostId.fetchFirstPageQuery(
        client,
        env.NEXT_PUBLIC_MAIN_CHAT_ID,
        1
      ),
      prefetchBlockedEntities(
        client,
        [env.NEXT_PUBLIC_MAIN_SPACE_ID].filter(Boolean),
        [env.NEXT_PUBLIC_MAIN_CHAT_ID, env.NEXT_PUBLIC_CONTEST_CHAT_ID].filter(
          Boolean
        )
      ),
    ])
    getPaginatedPostIdsByPostId.invalidateFirstQuery(
      client,
      env.NEXT_PUBLIC_MAIN_CHAT_ID
    )

    return {
      revalidate: 20,
      props: {
        dehydratedState: dehydrate(client),
      },
    }
  }
)

export default MemesPage
