import { PostData } from '@subsocial/api/types'
import { Fragment, memo } from 'react'
import ChatItemMenus from '../ChatItem/ChatItemMenus'
import { getMessageElementId } from '../utils'
import ChatItemContainer from './ChatItemContainer'
import { ScrollToMessage } from './hooks/useScrollToMessage'

const MemoizedChatItemContainer = memo(ChatItemContainer)

export type ChatItemWithMenuProps = {
  chatItemClassName?: string
  message: PostData | null | undefined
  isBottomMessage: boolean
  chatId: string
  hubId: string
  lastReadId: string | null | undefined
  scrollToMessage: ScrollToMessage
}
export function ChatItemWithMenu({
  message,
  isBottomMessage,
  chatItemClassName,
  chatId,
  hubId,
  lastReadId,
  scrollToMessage,
}: ChatItemWithMenuProps) {
  const isLastReadMessage = lastReadId === message?.id
  const showLastUnreadMessageNotice = isLastReadMessage && !isBottomMessage

  const chatElement = message ? (
    <ChatItemMenus
      chatId={chatId}
      messageId={message.id}
      key={message.id}
      hubId={hubId}
    >
      {(config) => {
        const { referenceProps, toggleDisplay } = config || {}
        return (
          <div
            {...referenceProps}
            className='flex flex-col'
            onContextMenu={(e) => {
              e.preventDefault()
              toggleDisplay?.(e)
            }}
          >
            <MemoizedChatItemContainer
              className={chatItemClassName}
              enableChatMenu={false}
              hubId={hubId}
              chatId={chatId}
              message={message}
              messageBubbleId={getMessageElementId(message.id)}
              scrollToMessage={scrollToMessage}
            />
          </div>
        )
      }}
    </ChatItemMenus>
  ) : null
  if (!showLastUnreadMessageNotice) return chatElement

  return (
    <Fragment>
      <div className='my-2 w-full rounded-md bg-background-light py-0.5 text-center text-sm'>
        Unread messages
      </div>
      {chatElement}
    </Fragment>
  )
}
const MemoizedChatItemWithMenu = memo(ChatItemWithMenu)
export default MemoizedChatItemWithMenu
