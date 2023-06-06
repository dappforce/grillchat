import Button from '@/components/Button'
import Container from '@/components/Container'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { JoinChatWrapper } from '@/services/subsocial/posts/mutation'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import { ComponentProps, useRef, useState } from 'react'
import AttachmentInput from './AttachmentInput'
import ChatForm from './ChatForm'

const ChatList = dynamic(() => import('../ChatList/ChatList'), {
  ssr: false,
})
const RepliedMessage = dynamic(() => import('./RepliedMessage'), {
  ssr: false,
})

export type ChatRoomProps = ComponentProps<'div'> & {
  asContainer?: boolean
  scrollableContainerClassName?: string
  chatId: string
  hubId: string
}

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  chatId,
  hubId,
  ...props
}: ChatRoomProps) {
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined)

  const Component = asContainer ? Container<'div'> : 'div'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer?.scrollTo({
        top: scrollContainer?.scrollHeight,
        behavior: 'auto',
      })
    }
  }

  const closeReply = () => setReplyTo(undefined)

  const { isJoined, isLoading: isLoadingJoinedChat } = useIsJoinedToChat(chatId)

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        hubId={hubId}
        newMessageNoticeClassName={cx(replyTo && 'bottom-2')}
        chatId={chatId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
        onSelectMessageAsReply={setReplyTo}
        replyTo={replyTo}
      />
      <Component
        className={cx('mt-auto flex flex-col py-3', replyTo && 'pt-0')}
      >
        {replyTo && (
          <RepliedMessage
            closeReply={closeReply}
            replyMessageId={replyTo}
            scrollContainer={scrollContainerRef}
          />
        )}
        {isJoined ? (
          <div className='flex items-center gap-2'>
            <AttachmentInput />
            <ChatForm
              chatId={chatId}
              onSubmit={scrollToBottom}
              replyTo={replyTo}
              clearReplyTo={closeReply}
            />
          </div>
        ) : (
          <JoinChatWrapper>
            {({ isLoading, mutateAsync }) => (
              <Button
                size='lg'
                isLoading={isLoading || isLoadingJoinedChat}
                onClick={() => mutateAsync({ chatId })}
              >
                Join
              </Button>
            )}
          </JoinChatWrapper>
        )}
      </Component>
    </div>
  )
}
