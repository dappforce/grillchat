import AddressAvatar from '@/components/AddressAvatar'
import CommonCustomContextMenu, {
  CommonCustomContextMenuProps,
} from '@/components/floating/CommonCustomContextMenu'
import Toast from '@/components/Toast'
import useRandomColor from '@/hooks/useRandomColor'
import useWrapInRef from '@/hooks/useWrapInRef'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { copyToClipboard } from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  SyntheticEvent,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiCircleStack, HiLink } from 'react-icons/hi2'
import { MdContentCopy } from 'react-icons/md'
import urlJoin from 'url-join'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import MetadataModal from './MetadataModal'
import DefaultChatItem from './variants/DefaultChatItem'
import EmojiChatItem, {
  shouldRenderEmojiChatItem,
} from './variants/EmojiChatItem'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  message: PostData
  onSelectMessageAsReply?: (chatId: string) => void
  isMyMessage: boolean
  messageBubbleId?: string
  scrollToMessage?: (chatId: string) => Promise<void>
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
  onSelectMessageAsReply,
  isMyMessage,
  scrollToMessage,
  messageBubbleId,
  ...props
}: ChatItemProps) {
  const router = useRouter()
  const commentId = message.id
  const isSent = !isOptimisticId(commentId)
  const [openMetadata, setOpenMetadata] = useState(false)
  const { createdAtTime, createdAtBlock, ownerId, contentId } = message.struct
  const { body, inReplyTo } = message.content || {}
  const senderColor = useRandomColor(ownerId)

  const sendEvent = useSendEvent()

  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })

  const setMessageAsReply = (commentId: string) => {
    if (isOptimisticId(commentId)) return
    onSelectMessageAsReply?.(commentId)
  }
  const setMessageAsReplyRef = useWrapInRef(setMessageAsReply)
  const menus = useMemo<CommonCustomContextMenuProps['menus']>(() => {
    return [
      {
        text: 'Reply',
        icon: (
          <BsFillReplyFill className='flex-shrink-0 text-xl text-text-muted' />
        ),
        onClick: () => setMessageAsReplyRef.current?.(commentId),
      },
      {
        text: 'Copy Text',
        icon: (
          <MdContentCopy className='flex-shrink-0 text-xl text-text-muted' />
        ),
        onClick: () => {
          copyToClipboard(body ?? '')
          toast.custom((t) => (
            <Toast t={t} title='Message copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Copy Message Link',
        icon: <HiLink className='flex-shrink-0 text-xl text-text-muted' />,
        onClick: () => {
          const chatPageLink = urlJoin(
            getCurrentUrlOrigin(),
            getChatPageLink(router)
          )
          copyToClipboard(urlJoin(chatPageLink, commentId))
          toast.custom((t) => (
            <Toast t={t} title='Message link copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Metadata',
        icon: (
          <HiCircleStack className='flex-shrink-0 text-xl text-text-muted' />
        ),
        onClick: () => setOpenMetadata(true),
      },
    ]
  }, [body, commentId, setMessageAsReplyRef, router])

  if (!body) return null

  const onCheckMarkClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  const isEmojiOnly = shouldRenderEmojiChatItem(body)

  const relativeTime = getTimeRelativeToNow(createdAtTime)

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
              onDoubleClick={() => setMessageAsReply(commentId)}
              {...referenceProps}
              id={messageBubbleId}
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
                scrollToMessage={scrollToMessage}
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
      <MetadataModal
        isOpen={openMetadata}
        closeModal={() => setOpenMetadata(false)}
        comment={message}
      />
    </div>
  )
}
