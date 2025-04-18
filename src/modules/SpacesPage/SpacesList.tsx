import Button from '@/components/Button'
import Loading from '@/components/Loading'
import useLoadMoreIfNoScroll from '@/components/chats/ChatList/hooks/useLoadMoreIfNoScroll'
import usePaginatedSpaceIds from '@/components/chats/hooks/useGetPaginatedSpaces'
import { SPACE_PER_PAGE, getSpaceQuery } from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import SpacePreview from '../SpacePage/SpacePreview'

type SpacesListProps = {
  spaceIds: string[]
  address: string
}

const SpacesList = ({ spaceIds, address }: SpacesListProps) => (
  <div className='flex flex-col gap-3 px-4 pt-6'>
    <div className='flex items-center justify-between gap-4 border-b border-[#d1d1d1] pb-3'>
      <span className='mb-0 text-2xl font-medium'>My spaces</span>
      <Button variant={'primaryOutline'} href={'/space/new'} size={'md'}>
        Create space
      </Button>
    </div>
    <div className='flex w-full flex-1 flex-col gap-4'>
      <SpacesInfiniteScroll address={address} />
    </div>
  </div>
)

type CustomInfiniteScrollProps = {
  address: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const SCROLL_THRESHOLD = 20

const SpacesInfiniteScroll = ({
  address,
  scrollContainerRef: _scrollContainerRef,
}: CustomInfiniteScrollProps) => {
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef
  const scrollableContainerId = useId()
  const myAddress = useMyMainAddress()

  const {
    spaceIds: currentPageSpaceIds,
    loadMore,
    totalDataCount,
  } = usePaginatedSpaceIds({
    address,
    isHidden: myAddress !== address,
  })

  const [renderedSpaceIds, setRenderedSpaceIds] =
    useState<string[]>(currentPageSpaceIds)

  const renderedSpaceQueries = getSpaceQuery.useQueries(renderedSpaceIds)

  const lastBatchIds = useMemo(
    () =>
      currentPageSpaceIds.slice(currentPageSpaceIds.length - SPACE_PER_PAGE),
    [currentPageSpaceIds]
  )

  const lastBatchQueries = getSpaceQuery.useQueries(lastBatchIds)

  const isLastBatchLoading = useIsAnyQueriesLoading([...lastBatchQueries])

  useEffect(() => {
    if (isLastBatchLoading) return
    setRenderedSpaceIds(() => {
      let newRenderedSpaceIds = [...currentPageSpaceIds]
      if (isLastBatchLoading) {
        newRenderedSpaceIds = newRenderedSpaceIds.slice(
          0,
          newRenderedSpaceIds.length - SPACE_PER_PAGE
        )
      }

      return newRenderedSpaceIds
    })
  }, [isLastBatchLoading, currentPageSpaceIds])

  useLoadMoreIfNoScroll(loadMore, renderedSpaceIds?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const isAllMessagesLoaded = renderedSpaceIds.length === totalDataCount

  return (
    <div className='flex-1'>
      <InfiniteScroll
        dataLength={renderedSpaceIds.length}
        next={() => {
          loadMore()
        }}
        className={cx(
          'relative flex w-full flex-col !overflow-visible pb-2',
          'min-h-[400px]'
        )}
        hasMore={!isAllMessagesLoaded}
        scrollableTarget={scrollableContainerId}
        loader={<Loading className='pb-2 pt-4' />}
        scrollThreshold={`${SCROLL_THRESHOLD}px`}
      >
        <div className='flex w-full flex-1 flex-col gap-4'>
          {renderedSpaceQueries.map(({ data: space }, index) => {
            const spaceId = space?.id

            return (
              <Fragment key={space?.id ?? index}>
                <SpacePreview key={spaceId} spaceId={spaceId} />
              </Fragment>
            )
          })}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default SpacesList
