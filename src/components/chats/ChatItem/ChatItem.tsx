import AddressAvatar from '@/components/AddressAvatar'
import ProfilePreviewModalWrapper from '@/components/ProfilePreviewModalWrapper'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, SyntheticEvent, useReducer } from 'react'
import ChatItemMenus from './ChatItemMenus'
import ChatItemWithExtension from './ChatItemWithExtension'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  message: PostData
  isMyMessage: boolean
  messageBubbleId?: string
  scrollToMessage?: (chatId: string) => Promise<void>
  enableChatMenu?: boolean
  chatId: string
}

type CheckMarkModalReducerState = {
  isOpen: boolean
  variant: CheckMarkModalVariant | ''
}
const checkMarkModalReducer = (
  state: CheckMarkModalReducerState,
  action: CheckMarkModalVariant | ''
): CheckMarkModalReducerState => {
  if (action === '') {
    return { ...state, isOpen: false }
  }
  return { isOpen: true, variant: action }
}

export default function ChatItem({
  message,
  isMyMessage,
  scrollToMessage,
  messageBubbleId,
  enableChatMenu = true,
  chatId,
  ...props
}: ChatItemProps) {
  const setReplyTo = useMessageData((state) => state.setReplyTo)

  const messageId = message.id
  const isSent = !isOptimisticId(messageId)
  const { createdAtTime, createdAtBlock, ownerId, contentId } = message.struct
  const { body, inReplyTo, extensions } = message.content || {}

  const sendEvent = useSendEvent()

  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })

  const setMessageAsReply = (messageId: string) => {
    if (isOptimisticId(messageId)) return
    setReplyTo(messageId)
  }

  if (!body && (!extensions || extensions.length === 0)) return null

  const onCheckMarkClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  const isEmojiOnly = shouldRenderEmojiChatItem(body ?? '')
  const ChatItemContentVariant = isEmojiOnly ? EmojiChatItem : DefaultChatItem

  return (
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
      <ChatItemMenus messageId={message.id} enableChatMenu={enableChatMenu}>
        {(config) => {
          const { toggleDisplay, referenceProps } = config || {}
          return (
            <div
              className={cx('flex flex-col overflow-hidden', props.className)}
              onContextMenu={(e) => {
                e.preventDefault()
                toggleDisplay?.(e)
              }}
              onDoubleClick={() => setMessageAsReply(messageId)}
              {...referenceProps}
              id={messageBubbleId}
            >
              {extensions && extensions.length > 0 ? (
                <ChatItemWithExtension
                  onCheckMarkClick={onCheckMarkClick}
                  scrollToMessage={scrollToMessage}
                  message={message}
                  isMyMessage={isMyMessage}
                />
              ) : (
                <ChatItemContentVariant
                  messageId={message.id}
                  body={body ?? ''}
                  isMyMessage={isMyMessage}
                  isSent={isSent}
                  onCheckMarkClick={onCheckMarkClick}
                  ownerId={ownerId}
                  createdAtTime={createdAtTime}
                  inReplyTo={inReplyTo}
                  scrollToMessage={scrollToMessage}
                />
              )}
            </div>
          )
        }}
      </ChatItemMenus>
      <CheckMarkExplanationModal
        isOpen={checkMarkModalState.isOpen}
        variant={checkMarkModalState.variant || 'recording'}
        closeModal={() => dispatch('')}
        blockNumber={createdAtBlock}
        cid={contentId}
      />
    </div>
  )
}
