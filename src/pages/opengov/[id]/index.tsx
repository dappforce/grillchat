import OpengovProposalDetailPage from '@/modules/opengov/OpengovProposalDetailPage'
import { getCommonStaticProps } from '@/utils/page'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps = getCommonStaticProps(
  () => ({ head: { title: 'Polkadot Open Governance' } }),
  async () => {
    return {
      props: {},
      revalidate: 20,
    }
  }
)

export default OpengovProposalDetailPage
