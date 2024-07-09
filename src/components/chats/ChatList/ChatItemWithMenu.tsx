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
  enableProfileModal?: boolean
  showBlockedMessage?: boolean
  scrollToMessage?: ScrollToMessage
  showApproveButton?: boolean
}
function InnerChatItemWithMenu({
  message,
  chatItemClassName,
  chatId,
  hubId,
  enableProfileModal = true,
  showBlockedMessage,
  scrollToMessage,
  showApproveButton,
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
              showBlockedMessage={showBlockedMessage}
              messageBubbleId={getMessageElementId(message.id)}
              enableProfileModal={enableProfileModal}
              scrollToMessage={scrollToMessage}
              showApproveButton={showApproveButton}
            />
          </div>
        )
      }}
    </ChatItemMenus>
  ) : null
}
const ChatItemWithMenu = memo(InnerChatItemWithMenu)
export default ChatItemWithMenu
