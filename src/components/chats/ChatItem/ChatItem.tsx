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
import { copyToClipboard } from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, RefObject, useMemo, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  comment: PostData
  onSelectChatAsReply?: (chatId: string) => void
  isMyMessage: boolean
  scrollContainer?: RefObject<HTMLElement | null>
  chatBubbleId?: string
  getRepliedElement?: (commentId: string) => Promise<HTMLElement | null>
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
  comment,
  onSelectChatAsReply,
  isMyMessage,
  scrollContainer,
  chatBubbleId,
  getRepliedElement,
  ...props
}: ChatItemProps) {
  const commentId = comment.id
  const isSent = !isOptimisticId(commentId)
  const { createdAtTime, createdAtBlock, ownerId, contentId } = comment.struct
  const { body, inReplyTo } = comment.content || {}

  const sendEvent = useSendEvent()

  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })

  const setChatAsReply = (commentId: string) => {
    if (isOptimisticId(commentId)) return
    onSelectChatAsReply?.(commentId)
  }
  const onSelectChatAsReplyRef = useWrapCallbackInRef(setChatAsReply)
  const menus = useMemo<DefaultCustomContextMenuProps['menus']>(() => {
    return [
      {
        text: 'Reply',
        onClick: () => onSelectChatAsReplyRef.current?.(commentId),
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
  }, [body, commentId, onSelectChatAsReplyRef])

  if (!body) return null

  const onCheckMarkClick = () => {
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  const isEmojiOnly = shouldRenderEmojiChatItem(body)

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
              onDoubleClick={() => setChatAsReply(commentId)}
              {...referenceProps}
              id={chatBubbleId}
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
                getRepliedElement={getRepliedElement}
                scrollContainer={scrollContainer}
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
