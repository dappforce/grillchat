import { env } from '@/env.mjs'
import MemesPage from '@/modules/telegram/MemesPage'
import { AppCommonProps } from '@/pages/_app'
import { prefetchBlockedEntities } from '@/server/moderation/prefetch'
import { getPostQuery } from '@/services/api/query'
import { getPaginatedPostIdsByPostId } from '@/services/datahub/posts/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { getProfilesServer } from '../api/profiles'

async function prefetchChatData(client: QueryClient, chatId: string) {
  if (!chatId) return

  // as now this query without myAddress is only used as placeholder data, no need to invalidate it
  const firstPageData = await getPaginatedPostIdsByPostId.fetchFirstPageQuery(
    client,
    { postId: chatId, onlyDisplayUnapprovedMessages: false, myAddress: '' },
    1
  )
  const ownerIds = firstPageData.data
    .map((id) => {
      const post = getPostQuery.getQueryData(client, id)
      return post?.struct.ownerId
    })
    .filter(Boolean)
  const profiles = await getProfilesServer(ownerIds)
  profiles.forEach((profile) => {
    getProfileQuery.setQueryData(client, profile.address, profile)
  })
}

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
      prefetchChatData(client, env.NEXT_PUBLIC_MAIN_CHAT_ID),
      prefetchChatData(client, env.NEXT_PUBLIC_CONTEST_CHAT_ID),
      prefetchBlockedEntities(
        client,
        [env.NEXT_PUBLIC_MAIN_SPACE_ID].filter(Boolean),
        [env.NEXT_PUBLIC_MAIN_CHAT_ID, env.NEXT_PUBLIC_CONTEST_CHAT_ID].filter(
          Boolean
        )
      ),
    ] as const)

    return {
      revalidate: 20,
      props: {
        dehydratedState: dehydrate(client),
      },
    }
  }
)

export default MemesPage
