import OpengovProposalDetailPage from '@/modules/opengov/OpengovProposalDetailPage'

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default OpengovProposalDetailPage
