import Button from '@/components/Button'
import Loading from '@/components/Loading'
import NoData from '@/components/NoData'
import useLoadMoreIfNoScroll from '@/components/chats/ChatList/hooks/useLoadMoreIfNoScroll'
import usePaginatedPostIdsBySpaceId from '@/components/chats/hooks/useGetPaginatedPostIdsBySpaceId'
import { getPostQuery } from '@/services/api/query'
import { getPostsBySpaceIdQuery } from '@/services/datahub/posts/query'
import { SPACE_PER_PAGE } from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/class-names'
import { SpaceData } from '@subsocial/api/types'
import { isEmptyStr } from '@subsocial/utils'
import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import InfiniteScroll from 'react-infinite-scroll-component'
import WritePostPreview from '../PostPage/EditPost/WritePostPreview'
import PostPreview from '../PostPage/PostPreview'
import SpacePreview from './SpacePreview'

type Props = {
  spaceData?: SpaceData
  showFullAbout?: boolean
  withTags?: boolean
}

export const renderSpaceName = (space: SpaceData) => {
  const name = space?.content?.name
  const spaceName = isEmptyStr(name) ? (
    <span className='text-text-muted'>{'Unnamed Space'}</span>
  ) : (
    name
  )

  return spaceName
}

const ViewSpace = ({ spaceData, withTags = true }: Props) => {
  const myAddress = useMyMainAddress()
  if (!spaceData) return null
  const isMySpace = spaceData.struct.ownerId === myAddress

  const { data: posts } = getPostsBySpaceIdQuery.useQuery(spaceData.id)

  const postsCount = posts?.length

  return (
    <div className='flex flex-col gap-6 p-6'>
      <SpacePreview
        spaceId={spaceData.id}
        withWrapper={false}
        withStats={true}
        withTags={withTags}
        showFullAbout={true}
      />
      {isMySpace && <WritePostPreview spaceId={spaceData.id} />}
      {!postsCount ? (
        <NoData
          message={'No posts yet'}
          button={
            <Button
              variant='primary'
              href={`/space/${spaceData.id}/posts/new`}
              className='flex items-center gap-2'
            >
              <IoMdAdd /> Create post
            </Button>
          }
        />
      ) : (
        <PostsInfiniteScroll spaceId={spaceData.id} />
      )}
    </div>
  )
}

const SCROLL_THRESHOLD = 20

type CustomInfiniteScrollProps = {
  spaceId: string
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const PostsInfiniteScroll = ({
  spaceId,
  scrollContainerRef: _scrollContainerRef,
}: CustomInfiniteScrollProps) => {
  const innerScrollContainerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = _scrollContainerRef || innerScrollContainerRef
  const scrollableContainerId = useId()
  const myAddress = useMyMainAddress()

  const {
    postIds: currentPagePostIds,
    loadMore,
    totalDataCount,
  } = usePaginatedPostIdsBySpaceId({
    spaceId,
  })

  const [renderedPostIds, setRenderedPostIds] =
    useState<string[]>(currentPagePostIds)

  const renderedPostQueries = getPostQuery.useQueries(renderedPostIds, {
    showHiddenPost: {
      type: 'owner',
      owner: myAddress || '',
    },
  })

  const lastBatchIds = useMemo(
    () => currentPagePostIds.slice(currentPagePostIds.length - SPACE_PER_PAGE),
    [currentPagePostIds]
  )

  const lastBatchQueries = getPostQuery.useQueries(lastBatchIds, {
    showHiddenPost: {
      type: 'owner',
      owner: myAddress || '',
    },
  })

  const isLastBatchLoading = useIsAnyQueriesLoading([...lastBatchQueries])

  useEffect(() => {
    if (isLastBatchLoading) return
    setRenderedPostIds(() => {
      let newRenderedPostIds = [...currentPagePostIds]
      if (isLastBatchLoading) {
        newRenderedPostIds = newRenderedPostIds.slice(
          0,
          newRenderedPostIds.length - SPACE_PER_PAGE
        )
      }

      return newRenderedPostIds
    })
  }, [isLastBatchLoading, currentPagePostIds])

  useLoadMoreIfNoScroll(loadMore, renderedPostIds?.length ?? 0, {
    scrollContainer: scrollContainerRef,
    innerContainer: innerRef,
  })

  const isAllMessagesLoaded = renderedPostIds.length === totalDataCount

  return (
    <div className='flex-1'>
      <InfiniteScroll
        dataLength={renderedPostIds.length}
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
          {renderedPostQueries.map(({ data: post }, index) => {
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

export default ViewSpace
