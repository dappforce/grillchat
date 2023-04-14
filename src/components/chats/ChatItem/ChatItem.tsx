import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import DefaultCustomContextMenu, {
  DefaultCustomContextMenuProps,
} from '@/components/floating/DefaultCustomContextMenu'
import LinkText from '@/components/LinkText'
import Toast from '@/components/Toast'
import useWrapInRef from '@/hooks/useWrapInRef'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { generateRandomColor } from '@/utils/random-colors'
import { generateRandomName } from '@/utils/random-name'
import { copyToClipboard } from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import Linkify from 'linkify-react'
import { ComponentProps, RefObject, useMemo, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { BsFillReplyFill } from 'react-icons/bs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import { MdContentCopy } from 'react-icons/md'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import RepliedMessagePreview from './RepliedMessagePreview'

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
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const senderColor = generateRandomColor(ownerId)

  const setChatAsReply = (commentId: string) => {
    if (isOptimisticId(commentId)) return
    onSelectChatAsReply?.(commentId)
  }
  const onSelectChatAsReplyRef = useWrapInRef(setChatAsReply)
  const menus = useMemo<DefaultCustomContextMenuProps['menus']>(() => {
    return [
      {
        text: 'Reply',
        icon: <BsFillReplyFill className='text-xl text-text-muted' />,
        onClick: () => onSelectChatAsReplyRef.current?.(commentId),
      },
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
  }, [body, commentId, onSelectChatAsReplyRef])

  if (!body) return null

  const onCheckMarkClick = () => {
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  const name = generateRandomName(ownerId)

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
      <DefaultCustomContextMenu menus={menus}>
        {(_, onContextMenu, referenceProps) => {
          return (
            <div
              id={chatBubbleId}
              onContextMenu={onContextMenu}
              onDoubleClick={() => setChatAsReply(commentId)}
              className={cx(
                'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl py-1.5 px-2.5',
                isMyMessage ? 'bg-background-primary' : 'bg-background-light'
              )}
              {...referenceProps}
            >
              {!isMyMessage && (
                <div className='flex items-center'>
                  <span
                    className='mr-2 text-sm text-text-secondary'
                    style={{ color: senderColor }}
                  >
                    {name}
                  </span>
                  <span className='text-xs text-text-muted'>
                    {relativeTime}
                  </span>
                </div>
              )}
              {inReplyTo?.id && (
                <RepliedMessagePreview
                  getRepliedElement={getRepliedElement}
                  scrollContainer={scrollContainer}
                  originalMessage={body}
                  className='mt-1'
                  repliedMessageId={inReplyTo.id}
                />
              )}
              <p className='whitespace-pre-wrap break-words text-base'>
                <Linkify
                  options={{
                    render: ({ content, attributes }) => (
                      <LinkText
                        {...attributes}
                        href={attributes.href}
                        variant={isMyMessage ? 'default' : 'secondary'}
                        className={cx('underline')}
                        openInNewTab
                      >
                        {content}
                      </LinkText>
                    ),
                  }}
                >
                  {body}
                </Linkify>
              </p>
              {isMyMessage && (
                <div
                  className={cx(
                    'flex items-center gap-1',
                    isMyMessage && 'self-end'
                  )}
                >
                  <span className='text-xs text-text-muted'>
                    {relativeTime}
                  </span>
                  <Button
                    variant='transparent'
                    size='noPadding'
                    interactive='brightness-only'
                    onClick={(e) => {
                      e.stopPropagation()
                      onCheckMarkClick()
                    }}
                  >
                    {isSent ? (
                      <IoCheckmarkDoneOutline className='text-sm' />
                    ) : (
                      <IoCheckmarkOutline
                        className={cx('text-sm text-text-muted')}
                      />
                    )}
                  </Button>
                </div>
              )}
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
