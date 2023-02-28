import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import {
  getCommentQuery,
  useCommentIdsByPostId,
} from '@/services/subsocial/queries'
import { cx } from '@/utils/className'
import {
  ComponentProps,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
} from 'react'
import ChatItem from './ChatItem'

export type ChatListProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
}

// ChatListContent needs to use useLayoutEffect, so it can't run in server.
export default function ChatList(props: ChatListProps) {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild) {
    return null
  }

  return <ChatListContent {...props} />
}

function ChatListContent({
  asContainer,
  scrollableContainerClassName,
  ...props
}: ChatListProps) {
  const id = useId()

  const postId = '226'
  const { data } = useCommentIdsByPostId(postId, {
    subscribe: true,
  })
  const results = getCommentQuery.useQueries(data ?? [])

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
      <div className={cx('flex flex-col gap-2')}>
        {results.map(({ data }, index) =>
          data?.content?.body ? (
            <div className={cx('w-10/12')} key={data.id}>
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
    </ScrollableContainer>
  )
}
