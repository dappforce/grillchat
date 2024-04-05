import { getHotPosts } from '@/services/datahub/hot-posts/query'
import { useFeedPagePostsCount } from '@/stores/feed-page-posts-count'
import { cx } from '@/utils/class-names'
import { useCallback, useId, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const PAGE_SIZE = 20

type HotPostsContentProps = {
  initialPostIds: string[]
  postsCount: number
}

const HotPostsContent = ({
  initialPostIds,
  postsCount,
}: HotPostsContentProps) => {
  const { hotPostsCount } = useFeedPagePostsCount()

  const [postsIds, setPostsIds] = useState(initialPostIds)
  const [page, setPage] = useState(initialPostIds ? 1 : 0)

  const scrollableContainerId = useId()

  const loadMore = useCallback(async () => {
    console.log('Load more hot posts')

    setPage((prev) => prev + 1)
    // getHotPosts is a function that returns a promise
    const newHotPosts = await getHotPosts({
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })

    const postsIds = newHotPosts.data.map((post) => post.persistentPostId)

    setPostsIds((prev) => [...prev, ...postsIds])
  }, [])

  const isAllMessagesLoaded = postsIds.length === (hotPostsCount || postsCount)

  return (
    <InfiniteScroll
      dataLength={hotPostsCount || postsCount}
      next={() => {
        loadMore()
      }}
      className={cx('relative flex flex-col !overflow-hidden pb-2')}
      hasMore={!isAllMessagesLoaded}
      scrollableTarget={scrollableContainerId}
      loader={'loading...'}
      endMessage={'end'}
      scrollThreshold={`${20}px`}
    >
      {postsIds.map((postId) => (
        <div key={postId} className='h-[100px]'>
          {postId}
        </div>
      ))}
    </InfiniteScroll>
  )
}

export default HotPostsContent
