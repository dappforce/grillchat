import useLoadMoreIfNoScroll from '@/components/chats/ChatList/hooks/useLoadMoreIfNoScroll'
import useGetHomePageSpaceIds from '@/components/chats/hooks/useGetHomePageSpaces'
import Loading from '@/components/Loading'
import { getSpaceQuery, SPACE_PER_PAGE } from '@/services/datahub/spaces/query'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import SpacePreview from '../SpacePage/SpacePreview'

type Props = {
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const SpacesTab = ({ scrollContainerRef: _scrollContainerRef }: Props) => {
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef
  const scrollableContainerId = useId()

  const {
    spaceIds: currentPageSpaceIds,
    loadMore,
    totalDataCount,
  } = useGetHomePageSpaceIds({})

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
          'min-h-[400px]'
        )}
        hasMore={!isAllMessagesLoaded}
        scrollableTarget={scrollableContainerId}
        loader={<Loading className='pb-2 pt-4' />}
        scrollThreshold={`20px`}
      >
        <div className='flex w-full flex-1 flex-col gap-4'>
          {renderedSpaceQueries.map(({ data: space }, index) => {
            const spaceId = space?.id

            return (
              <Fragment key={spaceId ?? index}>
                <SpacePreview spaceId={spaceId} />{' '}
              </Fragment>
            )
          })}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default SpacesTab
