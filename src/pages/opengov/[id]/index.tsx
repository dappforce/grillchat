import ProposalDetailPage, {
  ProposalDetailPageProps,
  getProposalResourceId,
} from '@/modules/opengov/ProposalDetailPage'
import { getDiscussion } from '@/pages/api/discussion'
import { getProposalDetailServer } from '@/pages/api/opengov/proposals/[id]'
import { getCommonStaticProps } from '@/utils/page'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

async function prefetchChat(proposalId: number) {
  const linkedResource = await getDiscussion(getProposalResourceId(proposalId))
  if (!linkedResource) return ''
  return linkedResource
}

export const getStaticProps = getCommonStaticProps<ProposalDetailPageProps>(
  () => ({ head: { title: 'Polkadot Open Governance' } }),
  async (ctx) => {
    const id = ctx.params?.id as string
    const parsedId = parseInt(id)
    if (!id || isNaN(parsedId)) return undefined

    const { data } = await getProposalDetailServer({ id: parsedId })

    return {
      props: {
        proposal: data,
        chatId: data.chatId,
      },
      revalidate: 20,
    }
  }
)

export default ProposalDetailPage
