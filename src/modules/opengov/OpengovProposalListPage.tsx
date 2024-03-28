import Button from '@/components/Button'
import FloatingMenus from '@/components/floating/FloatingMenus'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import ProposalPreview from '@/components/opengov/ProposalPreview'
import useSearch from '@/hooks/useSearch'
import { getPaginatedProposalsQuery } from '@/services/api/opengov/query'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { Fragment, useEffect, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'

const sortProposalOptions = [
  'request size',
  'newest',
  'recent comments',
  'total votes',
] as const
type SortProposalOption = (typeof sortProposalOptions)[number]

const sortByStorage = new LocalStorage(() => 'opengov-sort-by')
export default function OpengovProposalListPage() {
  const [sortBy, setSortBy] = useState<SortProposalOption | null>(null)
  useEffect(() => {
    const savedSortBy = sortByStorage.get() as SortProposalOption
    if (savedSortBy && sortProposalOptions.includes(savedSortBy)) {
      setSortBy(savedSortBy)
    } else {
      setSortBy('request size')
    }
  }, [])
  const changeSortBy = (sortBy: SortProposalOption) => {
    setSortBy(sortBy)
    sortByStorage.set(sortBy)
  }
  const { data: proposals, fetchNextPage } =
    getPaginatedProposalsQuery.useInfiniteQuery()

  const { search, setSearch, getFocusedElementIndex, focusController } =
    useSearch()

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
        {sortBy && (
          <OpengovToolbar sortBy={sortBy} changeSortBy={changeSortBy} />
        )}
        <div className='flex flex-col gap-2 p-2'>
          {proposals?.pages.map((page, index) => (
            <Fragment key={index}>
              {page.data.map((proposal) => (
                <div key={proposal.id}>
                  <ProposalPreview proposal={proposal} />
                </div>
              ))}
            </Fragment>
          ))}
          <Button onClick={() => fetchNextPage()}>load more</Button>
        </div>
      </div>
    </DefaultLayout>
  )
}

type OpengovToolbarProps = {
  sortBy: SortProposalOption
  changeSortBy: (sortBy: SortProposalOption) => void
}
function OpengovToolbar({ sortBy, changeSortBy }: OpengovToolbarProps) {
  return (
    <div
      className={cx(
        'flex items-center justify-between border-b border-border-gray px-2 py-3'
      )}
    >
      <div className='flex items-center gap-2 text-sm'>
        <span className='text-text-muted'>Sort by:</span>
        <FloatingMenus
          menus={[
            {
              text: 'Request size',
              onClick: () => changeSortBy('request size'),
            },
            {
              text: 'Newest',
              onClick: () => changeSortBy('newest'),
            },
            {
              text: 'Recent comments',
              onClick: () => changeSortBy('recent comments'),
            },
            {
              text: 'Total votes',
              onClick: () => changeSortBy('total votes'),
            },
          ]}
          allowedPlacements={['bottom-start']}
          mainAxisOffset={4}
          panelSize='xs'
        >
          {(config) => {
            const { referenceProps, toggleDisplay, isOpen } = config || {}
            return (
              <div
                {...referenceProps}
                onClick={toggleDisplay}
                className='flex cursor-pointer items-center gap-1 font-medium text-text-primary'
              >
                <span className='capitalize'>{sortBy}</span>
                <HiChevronDown
                  className={cx('transition-transform', isOpen && 'rotate-180')}
                />
              </div>
            )
          }}
        </FloatingMenus>
      </div>
    </div>
  )
}
