import ProposalDetailPage, {
  ProposalDetailPageProps,
} from '@/modules/opengov/ProposalDetailPage'
import { getProposalDetailServer } from '@/pages/api/opengov/proposals/[id]'
import { getPostsServer } from '@/pages/api/posts'
import { getPostQuery } from '@/services/api/query'
import { getPaginatedPostsByPostIdFromDatahubQuery } from '@/services/datahub/posts/query'
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
      const messages = await getPostsServer(res.data)
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
