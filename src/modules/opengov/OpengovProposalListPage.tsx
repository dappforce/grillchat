import Loading from '@/components/Loading'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProposalPreview from '@/components/opengov/ProposalPreview'
import { getPaginatedProposalsQuery } from '@/services/api/opengov/query'
import { cx } from '@/utils/class-names'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function OpengovProposalListPage() {
  const {
    data: proposals,
    fetchNextPage,
    hasNextPage,
  } = getPaginatedProposalsQuery.useInfiniteQuery()

  const flattenedPages = useMemo(() => {
    const proposalIds = new Set<number>()
    return (
      proposals?.pages
        .flatMap((page) => page.data)
        .filter((proposal) => {
          if (!proposal) return false
          const isExist = proposalIds.has(proposal.id)
          proposalIds.add(proposal.id)
          return !isExist
        }) ?? []
    )
  }, [proposals?.pages])

  return (
    <DefaultLayout withSidebar withSidebarBorder={false}>
      <div className='mx-auto flex flex-1 flex-col'>
        <InfiniteScroll
          hasMore={!!hasNextPage}
          next={fetchNextPage}
          loader={
            <Loading
              className='col-span-2 pb-2 pt-4'
              spinnerClassName={cx('border-border-gray')}
            />
          }
          dataLength={flattenedPages?.length ?? 0}
          className='flex flex-col gap-4 px-3 py-4'
        >
          {flattenedPages.map((proposal) => (
            <div key={proposal.id}>
              <ProposalPreview proposal={proposal} className='h-full' />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </DefaultLayout>
  )
}
