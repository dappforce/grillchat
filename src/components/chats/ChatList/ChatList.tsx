import useInfiniteScrollData from '@/components/chats/ChatList/hooks/useInfiniteScrollData'
import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getPostQuery } from '@/services/subsocial/posts'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { ComponentProps, useId, useMemo, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChatItemContainer from './ChatItemContainer'
import ChatLoading from './ChatLoading'
import ChatTopNotice from './ChatTopNotice'
import { NewMessageNotice } from './NewMessageNotice'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  postId: string
}

export default function ChatList(props: ChatListProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  if (!isInitialized) return null
  return <ChatListContent {...props} />
}

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  postId,
  ...props
}: ChatListProps) {
  const scrollableContainerId = useId()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: commentIds = [] } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const { currentData, loadMore } = useInfiniteScrollData(commentIds, 15, true)
  const posts = getPostQuery.useQueries(currentData)
  const loadedPost = useMemo(() => {
    return posts.filter((post) => post.isLoading === false)
  }, [posts])

  const Component = asContainer ? Container<'div'> : 'div'

  const isAllPostsLoaded = loadedPost.length === commentIds.length

  return (
    <Component
      {...props}
      className={cx(
        'relative flex flex-1 flex-col overflow-hidden',
        props.className
      )}
    >
      <ScrollableContainer
        id={scrollableContainerId}
        ref={scrollContainerRef}
        className={cx('flex flex-col-reverse', scrollableContainerClassName)}
      >
        <InfiniteScroll
          dataLength={loadedPost.length}
          next={loadMore}
          className={cx('relative flex flex-col-reverse gap-2 overflow-hidden')}
          hasMore={!isAllPostsLoaded}
          inverse
          scrollableTarget={scrollableContainerId}
          loader={<ChatLoading className='pb-2 pt-4' />}
          endMessage={<ChatTopNotice className='pb-2 pt-4' />}
          scrollThreshold='200px'
        >
          {posts.map(
            ({ data: post }) =>
              post && <ChatItemContainer post={post} key={post.id} />
          )}
        </InfiniteScroll>
      </ScrollableContainer>
      <NewMessageNotice
        className='absolute bottom-0 right-8'
        commentIds={commentIds}
        scrollContainerRef={scrollContainerRef}
      />
    </Component>
  )
}
