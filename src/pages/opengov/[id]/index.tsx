import { env } from '@/env.mjs'
import ProposalDetailPage, {
  ProposalDetailPageProps,
} from '@/modules/opengov/ProposalDetailPage'
import { prefetchBlockedEntities } from '@/old/server/moderation/prefetch'
import { getPostQuery } from '@/old/services/api/query'
import { getPaginatedPostsByPostIdFromDatahubQuery } from '@/old/services/datahub/posts/query'
import { getProposalDetailServer } from '@/pages/api/opengov/proposals/[id]'
import { getPostsServer } from '@/pages/api/posts'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps<ProposalDetailPageProps>(
  () => ({ head: { title: 'Polkadot Open Governance' } }),
  async (ctx) => {
    const id = ctx.params?.id as string
    const parsedId = parseInt(id)
    if (!id || isNaN(parsedId)) return undefined

    const { data } = await getProposalDetailServer({ id: parsedId })
    const queryClient = new QueryClient()
    if (data.chatId) {
      const res =
        await getPaginatedPostsByPostIdFromDatahubQuery.fetchFirstPageQuery(
          queryClient,
          data.chatId
        )
      getPaginatedPostsByPostIdFromDatahubQuery.invalidateFirstQuery(
        queryClient,
        data.chatId
      )
      const [messages] = await Promise.all([
        getPostsServer(res.data),
        prefetchBlockedEntities(
          queryClient,
          [env.NEXT_PUBLIC_PROPOSALS_HUB],
          [data.chatId]
        ),
      ] as const)
      messages.forEach((message) => {
        getPostQuery.setQueryData(queryClient, message.id, message)
      })
    }

    return {
      props: {
        proposal: data,
        chatId: data.chatId,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 20,
    }
  }
)

export default ProposalDetailPage
