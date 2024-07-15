import { FloatingWrapperProps } from '@/components/floating/FloatingWrapper'
import useLongTouch from '@/hooks/useLongTouch'
import { isTouchDevice } from '@/utils/device'
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
  disableSuperLike?: boolean
  scrollToMessage?: ScrollToMessage
  showApproveButton?: boolean
  menuIdPrefix?: string
}
function InnerChatItemWithMenu({
  message,
  chatItemClassName,
  chatId,
  hubId,
  enableProfileModal = true,
  showBlockedMessage,
  disableSuperLike,
  scrollToMessage,
  showApproveButton,
  menuIdPrefix,
}: ChatItemWithMenuProps) {
  return message ? (
    <ChatItemMenus
      chatId={chatId}
      messageId={message.id}
      key={message.id}
      hubId={hubId}
      menuIdPrefix={menuIdPrefix}
    >
      {(config) => (
        <ChatItemMenuWrapper config={config}>
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
            menuIdPrefix={menuIdPrefix}
          />
        </ChatItemMenuWrapper>
      )}
    </ChatItemMenus>
  ) : null
}

type ChatItemMenuWrapperProps = {
  config?: Parameters<FloatingWrapperProps['children']>[0]
  children: React.ReactNode
}

const ChatItemMenuWrapper = ({
  config,
  children,
}: ChatItemMenuWrapperProps) => {
  const { toggleDisplay, referenceProps } = config || {}

  const onLongPress = useLongTouch(
    (e) => {
      if (isTouchDevice()) {
        toggleDisplay?.(e)
      }
    },
    { delay: 500 }
  )

  return (
    <div
      {...referenceProps}
      className='flex select-none flex-col'
      {...onLongPress}
      onContextMenu={(e) => {
        if (!isTouchDevice()) {
          e.preventDefault()
          toggleDisplay?.(e)
        }
      }}
    >
      {children}
    </div>
  )
}
const ChatItemWithMenu = memo(InnerChatItemWithMenu)
export default ChatItemWithMenu
