import Loading from '@/components/Loading'
import useLoadMoreIfNoScroll from '@/components/chats/ChatList/hooks/useLoadMoreIfNoScroll'
import useGetHomePagePostIds from '@/components/chats/hooks/useGetHomePagePosts'
import { getPostQuery } from '@/services/api/query'
import { POSTS_PER_PAGE } from '@/services/datahub/posts/query'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostPreview from '../PostPage/PostPreview'

type Props = {
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const PostsTab = ({ scrollContainerRef: _scrollContainerRef }: Props) => {
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef
  const scrollableContainerId = useId()

  const {
    spaceIds: currentPagePostIds,
    loadMore,
    totalDataCount,
  } = useGetHomePagePostIds({})

  const [renderedSpaceIds, setRenderedSpaceIds] =
    useState<string[]>(currentPagePostIds)

  const renderedSpaceQueries = getPostQuery.useQueries(renderedSpaceIds)

  const lastBatchIds = useMemo(
    () => currentPagePostIds.slice(currentPagePostIds.length - POSTS_PER_PAGE),
    [currentPagePostIds]
  )

  const lastBatchQueries = getPostQuery.useQueries(lastBatchIds)

  const isLastBatchLoading = useIsAnyQueriesLoading([...lastBatchQueries])

  useEffect(() => {
    if (isLastBatchLoading) return
    setRenderedSpaceIds(() => {
      let newRenderedPostIds = [...currentPagePostIds]
      if (isLastBatchLoading) {
        newRenderedPostIds = newRenderedPostIds.slice(
          0,
          newRenderedPostIds.length - POSTS_PER_PAGE
        )
      }

      return newRenderedPostIds
    })
  }, [isLastBatchLoading, currentPagePostIds])

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
          {renderedSpaceQueries.map(({ data: post }, index) => {
            const postId = post?.id

            return (
              <Fragment key={postId ?? index}>
                <PostPreview postId={postId} />{' '}
              </Fragment>
            )
          })}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default PostsTab
