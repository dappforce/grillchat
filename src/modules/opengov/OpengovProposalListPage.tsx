import Container from '@/components/Container'
import FloatingMenus from '@/components/floating/FloatingMenus'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
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

  const { search, setSearch, getFocusedElementIndex, focusController } =
    useSearch()

  return (
    <DefaultLayout
      withSidebar
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
      {sortBy && <OpengovToolbar sortBy={sortBy} changeSortBy={changeSortBy} />}
    </DefaultLayout>
  )
}

type OpengovToolbarProps = {
  sortBy: SortProposalOption
  changeSortBy: (sortBy: SortProposalOption) => void
}
function OpengovToolbar({ sortBy, changeSortBy }: OpengovToolbarProps) {
  return (
    <Container
      className={cx(
        'flex items-center justify-between border-b border-border-gray py-3'
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
    </Container>
  )
}
