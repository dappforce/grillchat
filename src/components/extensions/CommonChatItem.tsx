import Button from '@/components/Button'
import RepliedMessagePreview from '@/components/chats/ChatItem/RepliedMessagePreview'
import LinkText from '@/components/LinkText'
import Name from '@/components/Name'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { PostData } from '@subsocial/api/types'
import Linkify from 'linkify-react'
import { SyntheticEvent } from 'react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

export type ExtensionChatItemProps = {
  message: PostData
  onCheckMarkClick: (e: SyntheticEvent) => void
  scrollToMessage?: (messageId: string) => Promise<void>
}

type DerivativesData = {
  isMyMessage: boolean
  relativeTime: string
  isSent: boolean
}
type CommonChatItemProps = ExtensionChatItemProps & {
  children: JSX.Element | ((derivativesData: DerivativesData) => JSX.Element)
  myMessageChildrenPosition?: 'top' | 'bottom'
  othersMessageChildrenPosition?: 'bottom'
}

export default function CommonChatItem({
  myMessageChildrenPosition = 'top',
  othersMessageChildrenPosition = 'bottom',
  message,
  children,
  scrollToMessage,
  onCheckMarkClick,
}: CommonChatItemProps) {
  const myAddress = useMyAccount((state) => state.address)
  const { struct, content } = message
  const { ownerId, createdAtTime } = struct
  const { inReplyTo, body } = content || {}

  const isMyMessage = ownerId === myAddress
  const relativeTime = getTimeRelativeToNow(createdAtTime)
  const isSent = !isOptimisticId(message.id)

  const childrenElement =
    typeof children === 'function'
      ? children({ isMyMessage, relativeTime, isSent })
      : children

  return (
    <div className={cx('flex flex-col')}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary dark:text-text-on-primary'
            : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center px-2.5 pt-1.5'>
            <Name ownerId={ownerId} />
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}

        {isMyMessage && myMessageChildrenPosition === 'top' && childrenElement}

        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='mx-2.5 mt-1'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
          />
        )}

        {!isMyMessage &&
          othersMessageChildrenPosition === 'bottom' &&
          childrenElement}

        <p
          className={cx(
            'whitespace-pre-wrap break-words px-2.5 text-base',
            !isMyMessage && 'pb-1.5'
          )}
        >
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

        {isMyMessage &&
          myMessageChildrenPosition === 'bottom' &&
          childrenElement}

        {isMyMessage && (
          <div
            className={cx(
              'flex items-center gap-1 px-2.5 pb-1.5',
              isMyMessage && 'self-end'
            )}
          >
            <span className='text-xs text-text-muted dark:text-text-muted-on-primary'>
              {relativeTime}
            </span>
            <Button
              variant='transparent'
              size='noPadding'
              interactive='brightness-only'
              onClick={onCheckMarkClick}
            >
              {isSent ? (
                <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
              ) : (
                <IoCheckmarkOutline
                  className={cx(
                    'text-muted text-sm dark:text-text-muted-on-primary'
                  )}
                />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
