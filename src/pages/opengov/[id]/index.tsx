import ProposalDetailPage, {
  ProposalDetailPageProps,
} from '@/modules/opengov/ProposalDetailPage'
import { getProposalDetailServer } from '@/pages/api/opengov/proposals/[id]'
import { getCommonStaticProps } from '@/utils/page'

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

    return {
      props: {
        proposal: data,
      },
      revalidate: 20,
    }
  }
)

export default ProposalDetailPage
