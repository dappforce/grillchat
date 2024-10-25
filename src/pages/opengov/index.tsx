import { PROPOSALS_PER_PAGE } from '@/constants/proposals'
import OpengovProposalListPage from '@/modules/opengov/OpengovProposalListPage'
import { getPaginatedProposalsQuery } from '@/old/services/api/opengov/query'
import { getCommonStaticProps } from '@/utils/page'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { getProposalsServer } from '../api/opengov/proposals'

export const getStaticProps = getCommonStaticProps(
  () => ({ head: { title: 'Polkadot Open Governance' } }),
  async () => {
    const queryClient = new QueryClient()
    try {
      const res = await getProposalsServer({
        page: 1,
        limit: PROPOSALS_PER_PAGE,
      })
      getPaginatedProposalsQuery.setFirstPageData(queryClient, res)
    } catch (err) {
      console.error('Error fetching proposals page', err)
    }

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 20,
    }
  }
)

export default OpengovProposalListPage
