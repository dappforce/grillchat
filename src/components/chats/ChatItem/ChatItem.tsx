import AddressAvatar from '@/components/AddressAvatar'
import DefaultCustomContextMenu, {
  DefaultCustomContextMenuProps,
} from '@/components/floating/DefaultCustomContextMenu'
import Toast from '@/components/Toast'
import useWrapCallbackInRef from '@/hooks/useWrapCallbackInRef'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { generateRandomColor } from '@/utils/random-colors'
import {
  copyToClipboard,
  getEmojiAmount,
  isTextContainsOnlyEmoji,
} from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, useMemo, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  post: PostData
  onSelectChatAsReply?: (chatId: string) => void
  isMyMessage: boolean
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
  post,
  onSelectChatAsReply,
  isMyMessage,
  ...props
}: ChatItemProps) {
  const postId = post.id
  const isSent = !isOptimisticId(postId)
  const { createdAtTime, createdAtBlock, ownerId, contentId } = post.struct
  const { body, inReplyTo } = post.content || {}

  const sendEvent = useSendEvent()

  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })

  const setChatAsReply = (postId: string) => {
    if (isOptimisticId(postId)) return
    onSelectChatAsReply?.(postId)
  }
  const onSelectChatAsReplyRef = useWrapCallbackInRef(setChatAsReply)
  const menus = useMemo<DefaultCustomContextMenuProps['menus']>(() => {
    return [
      {
        text: 'Reply',
        onClick: () => onSelectChatAsReplyRef.current?.(postId),
      },
      {
        text: 'Copy',
        onClick: () => {
          copyToClipboard(body ?? '')
          toast.custom((t) => (
            <Toast t={t} title='Message copied to clipboard!' />
          ))
        },
      },
    ]
  }, [body, postId, onSelectChatAsReplyRef])

  if (!body) return null

  const onCheckMarkClick = () => {
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  const emojiCount = getEmojiAmount(body)
  const isEmojiOnly =
    isTextContainsOnlyEmoji(body) &&
    emojiCount > 0 &&
    emojiCount <= MAX_EMOJI_AMOUNT

  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const senderColor = generateRandomColor(ownerId)

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
        <AddressAvatar address={ownerId} className='flex-shrink-0' />
      )}
      <DefaultCustomContextMenu
        menus={menus}
        allowedPlacements={
          isMyMessage
            ? ['left', 'left-end', 'left-start']
            : ['right', 'right-end', 'right-start']
        }
      >
        {(_, onContextMenu, referenceProps) => {
          return (
            <div
              className={cx('flex flex-col', props.className)}
              onContextMenu={onContextMenu}
              onDoubleClick={() => setChatAsReply(postId)}
              {...referenceProps}
            >
              <ChatItemContentVariant
                body={body}
                isMyMessage={isMyMessage}
                isSent={isSent}
                onCheckMarkClick={onCheckMarkClick}
                ownerId={ownerId}
                relativeTime={relativeTime}
                senderColor={senderColor}
                inReplyTo={inReplyTo}
              />
            </div>
          )
        }}
      </DefaultCustomContextMenu>
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
