import Container from '@/components/Container'
import ScrollableContainer from '@/components/ScrollableContainer'
import { getPostId } from '@/constants/space'
import {
  getCommentQuery,
  useCommentIdsByPostId,
} from '@/services/subsocial/queries'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { PostData } from '@subsocial/api/types'
import {
  ComponentProps,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
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
  const isInBottom = useRef(true)

  const { data } = useCommentIdsByPostId(getPostId(), {
    subscribe: true,
  })
  const results = getCommentQuery.useQueries(data ?? [])

  const Component = asContainer ? Container<'div'> : 'div'

  useLayoutEffect(() => {
    if (!isInBottom.current) return
    const chatRoom = document.getElementById(id)
    chatRoom?.scrollTo({ top: chatRoom.scrollHeight })
  }, [id, data?.length])

  useEffect(() => {
    const chatRoom = document.getElementById(id)
    const scrollListener = () => {
      if (!chatRoom) return
      isInBottom.current =
        chatRoom.scrollTop + chatRoom.clientHeight >= chatRoom.scrollHeight
    }
    chatRoom?.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      chatRoom?.removeEventListener('scroll', scrollListener)
    }
  }, [id])

  return (
    <ScrollableContainer
      {...props}
      as={Component}
      id={id}
      className={scrollableContainerClassName}
    >
      <div className={cx('flex flex-col gap-2')}>
        {results.map(
          ({ data }) =>
            data?.id && <ChatItemContainer data={data} key={data?.id} />
        )}
      </div>
    </ScrollableContainer>
  )
}

function ChatItemContainer({ data }: { data: PostData | null | undefined }) {
  const address = useMyAccount((state) => state.address)
  if (!data?.content?.body) return null

  const isSent = !isOptimisticId(data.id)
  const ownerId = data.struct.ownerId
  const isMyMessage = address === ownerId

  return (
    <div className={cx('w-10/12', isMyMessage && 'self-end')}>
      <ChatItem
        sentDate={data.struct.createdAtTime}
        senderAddress={ownerId}
        text={data.content.body}
        isSent={isSent}
      />
    </div>
  )
}
