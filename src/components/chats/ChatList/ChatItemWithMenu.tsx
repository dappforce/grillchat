import { PostData } from '@subsocial/api/types'
import { memo } from 'react'
import ChatItemMenus from '../ChatItem/ChatItemMenus'
import { getMessageElementId } from '../utils'
import ChatItemContainer from './ChatItemContainer'
import { ScrollToMessage } from './hooks/useScrollToMessage'

const MemoizedChatItemContainer = memo(ChatItemContainer)

export type ChatItemWithMenuProps = {
  chatItemClassName?: string
  message: PostData | null | undefined
  chatId: string
  hubId: string
  scrollToMessage: ScrollToMessage
}
export function ChatItemWithMenu({
  message,
  chatItemClassName,
  chatId,
  hubId,
  scrollToMessage,
}: ChatItemWithMenuProps) {
  return message ? (
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
}
const MemoizedChatItemWithMenu = memo(ChatItemWithMenu)
export default MemoizedChatItemWithMenu
