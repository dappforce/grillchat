import SpacePreview from '@/modules/SpacePage/SpacePreview'
import { getSpaceQuery, SPACE_PER_PAGE } from '@/services/datahub/spaces/query'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useLoadMoreIfNoScroll from './chats/ChatList/hooks/useLoadMoreIfNoScroll'
import usePaginatedSpaceIds from './chats/hooks/useGetPaginatedSpaces'
import Loading from './Loading'

type CustomInfiniteScrollProps = {
  address: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const SCROLL_THRESHOLD = 20

const CustomInfiniteScroll = ({
  address,
  scrollContainerRef: _scrollContainerRef,
}: CustomInfiniteScrollProps) => {
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef
  const scrollableContainerId = useId()

  const {
    spaceIds: currentPageSpaceIds,
    loadMore,
    totalDataCount,
  } = usePaginatedSpaceIds({
    address,
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
          'relative flex w-full flex-col !overflow-hidden pb-2',
          // need to have enough room to open message menu
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

export default CustomInfiniteScroll
