import ClickableAddressAvatar from '@/components/ClickableAddressAvatar'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import Toast from '@/components/Toast'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { copyToClipboard } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { ComponentProps, SyntheticEvent, useReducer, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiCircleStack, HiLink } from 'react-icons/hi2'
import { MdContentCopy } from 'react-icons/md'
import urlJoin from 'url-join'
import MetadataModal from '../../modals/MetadataModal'
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
  withCustomMenu?: boolean
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
  withCustomMenu = true,
  ...props
}: ChatItemProps) {
  const setReplyTo = useMessageData((state) => state.setReplyTo)

  const router = useRouter()
  const messageId = message.id
  const isSent = !isOptimisticId(messageId)
  const [openMetadata, setOpenMetadata] = useState(false)
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

  const getChatMenus = (): FloatingMenusProps['menus'] => {
    return [
      {
        text: 'Reply',
        icon: BsFillReplyFill,
        onClick: () => setMessageAsReply(messageId),
      },
      {
        text: 'Copy Text',
        icon: MdContentCopy,
        onClick: () => {
          copyToClipboard(body ?? '')
          toast.custom((t) => (
            <Toast t={t} title='Message copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Copy Message Link',
        icon: HiLink,
        onClick: () => {
          const chatPageLink = urlJoin(
            getCurrentUrlOrigin(),
            getChatPageLink(router)
          )
          copyToClipboard(urlJoin(chatPageLink, messageId))
          toast.custom((t) => (
            <Toast t={t} title='Message link copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Show Metadata',
        icon: HiCircleStack,
        onClick: () => setOpenMetadata(true),
      },
    ]
  }
  const menus = withCustomMenu && isSent ? getChatMenus() : []

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

  const relativeTime = getTimeRelativeToNow(createdAtTime)

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
        <ClickableAddressAvatar address={ownerId} className='flex-shrink-0' />
      )}
      <FloatingMenus menus={menus} alignment='end' useClickPointAsAnchor>
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
              {extensions ? (
                <ChatItemWithExtension
                  onCheckMarkClick={onCheckMarkClick}
                  scrollToMessage={scrollToMessage}
                  message={message}
                />
              ) : (
                <ChatItemContentVariant
                  body={body ?? ''}
                  isMyMessage={isMyMessage}
                  isSent={isSent}
                  onCheckMarkClick={onCheckMarkClick}
                  ownerId={ownerId}
                  relativeTime={relativeTime}
                  inReplyTo={inReplyTo}
                  scrollToMessage={scrollToMessage}
                />
              )}
            </div>
          )
        }}
      </FloatingMenus>
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
        entity={message}
      />
    </div>
  )
}
