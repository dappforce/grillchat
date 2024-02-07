import AddressAvatar from '@/components/AddressAvatar'
import ProfilePreviewModalWrapper from '@/components/ProfilePreviewModalWrapper'
import { env } from '@/env.mjs'
import { isMessageSent } from '@/services/subsocial/commentIds/optimistic'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { ScrollToMessage } from '../ChatList/hooks/useScrollToMessage'
import ChatItemMenus from './ChatItemMenus'
import ChatItemWithExtension from './ChatItemWithExtension'
import Embed, { useCanRenderEmbed } from './Embed'
import { getMessageStatusById } from './MessageStatusIndicator'
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
  chatId: string
  hubId: string
}

export default function ChatItem({
  message,
  isMyMessage,
  scrollToMessage,
  messageBubbleId,
  enableChatMenu = true,
  chatId,
  hubId,
  ...props
}: ChatItemProps) {
  const setReplyTo = useMessageData((state) => state.setReplyTo)

  const messageId = message.id
  const { ownerId, dataType } = message.struct
  const { body, extensions, link } = message.content || {}

  const setMessageAsReply = () => {
    if (!isMessageSent(messageId, dataType)) return
    setReplyTo(messageId)
  }

  const canRenderEmbed = useCanRenderEmbed(link ?? '')

  if (!body && (!extensions || extensions.length === 0)) return null

  const isEmojiOnly = shouldRenderEmojiChatItem(body ?? '')
  const ChatItemContentVariant = isEmojiOnly ? EmojiChatItem : DefaultChatItem

  const messageStatus = getMessageStatusById(message)

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
          <ProfilePreviewModalWrapper address={ownerId} messageId={message.id}>
            {(onClick) => (
              <AddressAvatar
                onClick={onClick}
                address={ownerId}
                className='flex-shrink-0 cursor-pointer'
              />
            )}
          </ProfilePreviewModalWrapper>
        )}
        <ChatItemMenus
          chatId={chatId}
          messageId={message.id}
          enableChatMenu={enableChatMenu}
          hubId={hubId}
        >
          {(config) => {
            const { toggleDisplay, referenceProps } = config || {}
            const showChip =
              messageStatus === 'offChain' &&
              !isMyMessage &&
              env.NEXT_PUBLIC_OFFCHAIN_POSTING_HUBS.includes(hubId)

            return (
              <div
                className={cx(
                  'relative flex flex-col',
                  !showChip && 'overflow-hidden'
                )}
                onContextMenu={(e) => {
                  e.preventDefault()
                  toggleDisplay?.(e)
                }}
                onDoubleClick={() => setMessageAsReply()}
                {...referenceProps}
                id={messageBubbleId}
              >
                {showChip && (
                  <div
                    className={cx(
                      'absolute right-0 top-0 z-10 -translate-y-1/3 translate-x-1/2 rounded-full bg-background-primary px-2 py-0.5 text-[8px] text-text-on-primary',
                      isMyMessage && 'left-0 right-auto -translate-x-1/2'
                    )}
                  >
                    Web2
                  </div>
                )}
                {extensions && extensions.length > 0 ? (
                  <ChatItemWithExtension
                    scrollToMessage={scrollToMessage}
                    message={message}
                    isMyMessage={isMyMessage}
                    chatId={chatId}
                    hubId={hubId}
                  />
                ) : (
                  <ChatItemContentVariant
                    message={message}
                    isMyMessage={isMyMessage}
                    scrollToMessage={scrollToMessage}
                    chatId={chatId}
                    hubId={hubId}
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
