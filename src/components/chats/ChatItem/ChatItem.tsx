import AddressAvatar from '@/components/AddressAvatar'
import { useProfilePostsModal } from '@/stores/profile-posts-modal'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { ScrollToMessage } from '../ChatList/hooks/useScrollToMessage'
import ChatItemMenus from './ChatItemMenus'
import ChatItemWithExtension from './ChatItemWithExtension'
import Embed, { useCanRenderEmbed } from './Embed'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  message: PostData
  isMyMessage: boolean
  messageBubbleId?: string
  scrollToMessage?: ScrollToMessage
  enableChatMenu?: boolean
  enableProfileModal?: boolean
  chatId: string
  hubId: string
  bg?: 'background-light' | 'background'
  showApproveButton?: boolean
  menuIdPrefix?: string
}

export default function ChatItem({
  message,
  isMyMessage,
  scrollToMessage,
  messageBubbleId,
  enableChatMenu = true,
  chatId,
  hubId,
  bg = 'background-light',
  showApproveButton,
  enableProfileModal = true,
  menuIdPrefix,
  ...props
}: ChatItemProps) {
  const { ownerId, id: messageId } = message.struct
  const { body, extensions, link } = message.content || {}
  const { openModal } = useProfilePostsModal()

  const canRenderEmbed = useCanRenderEmbed(link ?? '')

  if (showApproveButton && message.struct.approvedInRootPost) return null

  if (!body && (!extensions || extensions.length === 0)) return null

  const isEmojiOnly = shouldRenderEmojiChatItem(body ?? '')
  const ChatItemContentVariant = isEmojiOnly ? EmojiChatItem : DefaultChatItem

  return (
    <>
      <div
        {...props}
        className={cx(
          'relative flex items-start justify-start gap-2',
          isMyMessage && 'flex-row-reverse',
          props.className
        )}
      >
        {!isMyMessage && (
          <AddressAvatar
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (enableProfileModal) {
                openModal({ chatId, hubId, messageId, address: ownerId })
              }
            }}
            address={ownerId}
            className='flex-shrink-0 cursor-pointer'
          />
        )}
        <ChatItemMenus
          menuIdPrefix={menuIdPrefix}
          chatId={chatId}
          messageId={message.id}
          enableChatMenu={enableChatMenu}
          hubId={hubId}
        >
          {(config) => {
            const { toggleDisplay, referenceProps } = config || {}

            return (
              <div
                className={cx('relative flex flex-col')}
                onContextMenu={(e) => {
                  e.preventDefault()
                  toggleDisplay?.(e)
                }}
                {...referenceProps}
                id={messageBubbleId}
              >
                {extensions && extensions.length > 0 ? (
                  <ChatItemWithExtension
                    scrollToMessage={scrollToMessage}
                    message={message}
                    isMyMessage={isMyMessage}
                    chatId={chatId}
                    hubId={hubId}
                    enableProfileModal={enableProfileModal}
                    bg={bg}
                    showApproveButton={showApproveButton}
                  />
                ) : (
                  <ChatItemContentVariant
                    message={message}
                    isMyMessage={isMyMessage}
                    scrollToMessage={scrollToMessage}
                    chatId={chatId}
                    enableProfileModal={enableProfileModal}
                    hubId={hubId}
                    bg={bg}
                  />
                )}
              </div>
            )
          }}
        </ChatItemMenus>
      </div>
      {canRenderEmbed && (
        <div className={cx(isMyMessage ? 'flex justify-end' : 'flex')}>
          {/* Offset for avatar */}
          {!isMyMessage && <div className='w-11 flex-shrink-0' />}
          <Embed
            className={cx('mt-1', isMyMessage ? 'flex justify-end' : 'flex')}
            link={link ?? ''}
          />
        </div>
      )}
    </>
  )
}
