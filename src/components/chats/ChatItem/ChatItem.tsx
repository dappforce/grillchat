import AddressAvatar from '@/components/AddressAvatar'
import CommonCustomContextMenu, {
  CommonCustomContextMenuProps,
} from '@/components/floating/CommonCustomContextMenu'
import Toast from '@/components/Toast'
import { SelectedMessage } from '@/services/subsocial/commentIds'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { generateRandomColor } from '@/utils/random-colors'
import { copyToClipboard } from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, RefObject, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiPencil } from 'react-icons/hi2'
import { MdContentCopy } from 'react-icons/md'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  comment: PostData
  onSelectMessage?: (selectedMessage: SelectedMessage) => void
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
  onSelectMessage,
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
    onSelectMessage?.({ id: commentId, type: 'reply' })
  }
  const getMenus = (): CommonCustomContextMenuProps['menus'] => {
    const editMenus = isMyMessage
      ? [
          {
            text: 'Edit',
            icon: <HiPencil className='text-xl text-text-muted' />,
            onClick: () => {
              if (isOptimisticId(commentId)) return
              onSelectMessage?.({ id: commentId, type: 'edit' })
            },
          },
        ]
      : []

    return [
      {
        text: 'Reply',
        icon: <BsFillReplyFill className='text-xl text-text-muted' />,
        onClick: () => setChatAsReply(commentId),
      },
      ...editMenus,
      {
        text: 'Copy',
        icon: <MdContentCopy className='text-xl text-text-muted' />,
        onClick: () => {
          copyToClipboard(body ?? '')
          toast.custom((t) => (
            <Toast t={t} title='Message copied to clipboard!' />
          ))
        },
      },
    ]
  }
  const menus = getMenus()

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
      <CommonCustomContextMenu menus={menus}>
        {(_, onContextMenu, referenceProps) => {
          return (
            <div
              className={cx('flex flex-col overflow-hidden', props.className)}
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
      </CommonCustomContextMenu>
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
