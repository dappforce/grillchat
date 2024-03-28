import Loading from '@/components/Loading'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import ProposalPreview from '@/components/opengov/ProposalPreview'
import useSearch from '@/hooks/useSearch'
import { getPaginatedProposalsQuery } from '@/services/api/opengov/query'
import { cx } from '@/utils/class-names'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

// const sortProposalOptions = [
//   'request size',
//   'newest',
//   'recent comments',
//   'total votes',
// ] as const
// type SortProposalOption = (typeof sortProposalOptions)[number]

// const sortByStorage = new LocalStorage(() => 'opengov-sort-by')
export default function OpengovProposalListPage() {
  // const [sortBy, setSortBy] = useState<SortProposalOption | null>(null)
  // useEffect(() => {
  //   const savedSortBy = sortByStorage.get() as SortProposalOption
  //   if (savedSortBy && sortProposalOptions.includes(savedSortBy)) {
  //     setSortBy(savedSortBy)
  //   } else {
  //     setSortBy('request size')
  //   }
  // }, [])
  // const changeSortBy = (sortBy: SortProposalOption) => {
  //   setSortBy(sortBy)
  //   sortByStorage.set(sortBy)
  // }
  const {
    data: proposals,
    fetchNextPage,
    hasNextPage,
  } = getPaginatedProposalsQuery.useInfiniteQuery()

  const { search, setSearch, getFocusedElementIndex, focusController } =
    useSearch()

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
    <DefaultLayout
      withSidebar
      withSidebarBorder={false}
      navbarProps={{
        customContent: ({ logoLink, authComponent, notificationBell }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-0'>
                    {searchButton}
                    {notificationBell}
                    <div className='ml-2.5'>{authComponent}</div>
                  </div>
                </div>
              )}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      <div className='mx-auto flex max-w-screen-md flex-1 flex-col'>
        {/* {sortBy && (
          <OpengovToolbar sortBy={sortBy} changeSortBy={changeSortBy} />
        )} */}
        <InfiniteScroll
          hasMore={!!hasNextPage}
          next={fetchNextPage}
          loader={
            <Loading
              className='pb-2 pt-4'
              spinnerClassName={cx(
                'border-border-gray dark:bg-background-lightest'
              )}
            />
          }
          dataLength={flattenedPages?.length ?? 0}
          className='flex flex-col gap-2 p-2'
        >
          {flattenedPages.map((proposal) => (
            <div key={proposal.id}>
              <ProposalPreview proposal={proposal} />
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
