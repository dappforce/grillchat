import Button from '@/components/Button'
import Container from '@/components/Container'
import ExtensionModals from '@/components/extensions'
import TextArea from '@/components/inputs/TextArea'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { getPostQuery } from '@/services/api/query'
import { JoinChatWrapper } from '@/services/subsocial/posts/mutation'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import { ComponentProps, useEffect, useRef } from 'react'
import ChatInputBar from './ChatInputBar'

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

const HUB_ID_WITHOUT_JOIN_BUTTON = [
  '1023',
  '1002',
  '1005',
  '1010',
  '1011',
  '1007',
]

export default function ChatRoom({
  className,
  asContainer,
  scrollableContainerClassName,
  chatId,
  hubId,
  ...props
}: ChatRoomProps) {
  const clearReplyTo = useMessageData((state) => state.clearReplyTo)
  const replyTo = useMessageData((state) => state.replyTo)
  useEffect(() => {
    return () => clearReplyTo()
  }, [clearReplyTo])
  const showEmptyPrimaryChatInput = useMessageData(
    (state) => state.showEmptyPrimaryChatInput
  )

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

  const { isJoined, isLoading: isLoadingJoinedChat } = useIsJoinedToChat(chatId)
  const isHubWithoutJoinButton = HUB_ID_WITHOUT_JOIN_BUTTON.includes(hubId)

  const { data: chat } = getPostQuery.useQuery(chatId, {
    showHiddenPost: { type: 'all' },
  })
  const isHidden = chat?.struct.hidden

  return (
    <div {...props} className={cx('flex flex-col', className)}>
      <ChatList
        hubId={hubId}
        newMessageNoticeClassName={cx(replyTo && 'bottom-2')}
        chatId={chatId}
        asContainer={asContainer}
        scrollableContainerClassName={scrollableContainerClassName}
        scrollContainerRef={scrollContainerRef}
        replyTo={replyTo}
      />
      <Component
        className={cx('mt-auto flex flex-col py-2', replyTo && 'pt-0')}
      >
        {replyTo && !showEmptyPrimaryChatInput && (
          <RepliedMessage
            replyMessageId={replyTo}
            scrollContainer={scrollContainerRef}
          />
        )}
        {(() => {
          if (isHidden)
            return (
              <TextArea
                rows={1}
                disabled
                value='You cannot send messages in a hidden chat'
                className='bg-background-light/50 text-center text-text-muted !brightness-100'
                variant='fill'
                pill
              />
            )

          if (isJoined || isHubWithoutJoinButton)
            return (
              <ChatInputBar
                hubId={hubId}
                formProps={{
                  chatId,
                  onSubmit: scrollToBottom,
                  isPrimary: true,
                }}
              />
            )

          return (
            <JoinChatWrapper>
              {({ isLoading, mutateAsync }) => {
                const isButtonLoading = isLoading || isLoadingJoinedChat
                return (
                  <Button
                    size='lg'
                    className={cx(
                      isButtonLoading && 'bg-background-light text-text-muted'
                    )}
                    disabledStyle='subtle'
                    isLoading={isButtonLoading}
                    onClick={() => mutateAsync({ chatId })}
                  >
                    Join
                  </Button>
                )
              }}
            </JoinChatWrapper>
          )
        })()}
      </Component>

      <ExtensionModals chatId={chatId} onSubmit={scrollToBottom} />
    </div>
  )
}
