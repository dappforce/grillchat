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
          className='flex flex-col gap-2 p-3'
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

// type OpengovToolbarProps = {
//   sortBy: SortProposalOption
//   changeSortBy: (sortBy: SortProposalOption) => void
// }
// function OpengovToolbar({ sortBy, changeSortBy }: OpengovToolbarProps) {
//   return (
//     <div
//       className={cx(
//         'flex items-center justify-between border-b border-border-gray px-2 py-3'
//       )}
//     >
//       <div className='flex items-center gap-2 text-sm'>
//         <span className='text-text-muted'>Sort by:</span>
//         <FloatingMenus
//           menus={[
//             {
//               text: 'Request size',
//               onClick: () => changeSortBy('request size'),
//             },
//             {
//               text: 'Newest',
//               onClick: () => changeSortBy('newest'),
//             },
//             {
//               text: 'Recent comments',
//               onClick: () => changeSortBy('recent comments'),
//             },
//             {
//               text: 'Total votes',
//               onClick: () => changeSortBy('total votes'),
//             },
//           ]}
//           allowedPlacements={['bottom-start']}
//           mainAxisOffset={4}
//           panelSize='xs'
//         >
//           {(config) => {
//             const { referenceProps, toggleDisplay, isOpen } = config || {}
//             return (
//               <div
//                 {...referenceProps}
//                 onClick={toggleDisplay}
//                 className='flex cursor-pointer items-center gap-1 font-medium text-text-primary'
//               >
//                 <span className='capitalize'>{sortBy}</span>
//                 <HiChevronDown
//                   className={cx('transition-transform', isOpen && 'rotate-180')}
//                 />
//               </div>
//             )
//           }}
//         </FloatingMenus>
//       </div>
//     </div>
//   )
// }
