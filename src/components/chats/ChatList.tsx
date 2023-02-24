import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { useCommentIdsByPostId, useGetComments } from '@/services/queries'
import { useIsAnyQueriesLoading } from '@/subsocial-query'
import { cx } from '@/utils/className'
import { ComponentProps, useId, useLayoutEffect } from 'react'
import ChatItem from './ChatItem'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
}

export default function ChatList({
  asContainer,
  scrollableContainerClassName,
  ...props
}: ChatListProps) {
  const id = useId()

  const postId = '226'
  const { data, isLoading: isLoadingIds } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const results = useGetComments(data ?? [])
  const isLoading = useIsAnyQueriesLoading(results) || isLoadingIds

  const Component = asContainer ? Container<'div'> : 'div'

  useLayoutEffect(() => {
    const chatRoom = document.getElementById(id)
    chatRoom?.scrollTo({ top: chatRoom.scrollHeight })
  }, [id])

  return (
    <ScrollableContainer
      {...props}
      as={Component}
      id={id}
      className={scrollableContainerClassName}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={cx('flex flex-col gap-2')}>
          {results.map(({ data }, index) =>
            data?.content?.body ? (
              <div className={cx('w-10/12')} key={index}>
                <ChatItem
                  sentDate={data.struct.createdAtTime}
                  senderAddress={data.struct.ownerId}
                  alignment='left'
                  text={data?.content?.body ?? 'empty?'}
                />
              </div>
            ) : null
          )}
        </div>
      )}
    </ScrollableContainer>
  )
}
