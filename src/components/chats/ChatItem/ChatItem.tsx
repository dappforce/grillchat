import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import DefaultCustomContextMenu, {
  DefaultCustomContextMenuProps,
} from '@/components/floating/DefaultCustomContextMenu'
import LinkText from '@/components/LinkText'
import Toast from '@/components/Toast'
import useWrapCallbackInRef from '@/hooks/useWrapCallbackInRef'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { generateRandomColor } from '@/utils/random-colors'
import { copyToClipboard } from '@/utils/text'
import { PostData } from '@subsocial/api/types'
import Linkify from 'linkify-react'
import { ComponentProps, useMemo, useReducer } from 'react'
import { toast } from 'react-hot-toast'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'
import RepliedMessagePreview from './RepliedMessagePreview'

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
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const senderColor = generateRandomColor(ownerId)

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
              onContextMenu={onContextMenu}
              onDoubleClick={() => setChatAsReply(postId)}
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
                    {truncateAddress(ownerId)}
                  </span>
                  <span className='text-xs text-text-muted'>
                    {relativeTime}
                  </span>
                </div>
              )}
              {inReplyTo && (
                <RepliedMessagePreview
                  originalMessage={body}
                  className='mt-1'
                  replyTo={inReplyTo.id}
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
