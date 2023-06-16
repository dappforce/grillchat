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
import ProfileModalWrapper from '../ProfileModalWrapper'

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

type MyMessageConfig = {
  children?: 'top' | 'bottom'
  checkMark?: 'outside' | 'inside'
}
type OthersMessageConfig = {
  children?: 'bottom'
}

type CommonChatItemProps = ExtensionChatItemProps & {
  children: JSX.Element | ((derivativesData: DerivativesData) => JSX.Element)
  myMessageConfig?: MyMessageConfig
  othersMessage?: OthersMessageConfig
  className?: string
}

const defaultMyMessageConfig: MyMessageConfig = {
  children: 'bottom',
  checkMark: 'inside',
}
const defaultOthersMessageConfig: OthersMessageConfig = {
  children: 'bottom',
}
export default function CommonChatItem({
  myMessageConfig = defaultMyMessageConfig,
  othersMessage = defaultOthersMessageConfig,
  message,
  children,
  scrollToMessage,
  onCheckMarkClick,
  className,
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

  const checkMarkElement = (
    <div
      className={cx(
        'flex items-center gap-1 px-2.5 last:pb-1.5',
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
            className={cx('text-muted text-sm dark:text-text-muted-on-primary')}
          />
        )}
      </Button>
    </div>
  )

  return (
    <div className={cx('flex flex-col gap-2')}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary dark:text-text-on-primary'
            : 'bg-background-light',
          className
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center px-2.5 first:pt-1.5'>
            <ProfileModalWrapper address={ownerId}>
              {(onClick) => (
                <Name
                  onClick={onClick}
                  className={cx(
                    'mr-2 cursor-pointer text-sm text-text-secondary'
                  )}
                  address={ownerId}
                />
              )}
            </ProfileModalWrapper>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}

        {isMyMessage && myMessageConfig.children === 'top' && childrenElement}

        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='mx-2.5 mt-1 first:mt-2.5'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
          />
        )}

        {body && (
          <p
            className={cx(
              'whitespace-pre-wrap break-words px-2.5 text-base first:pt-1.5 last:pb-1.5'
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
        )}

        {!isMyMessage && othersMessage.children === 'bottom' && childrenElement}

        {isMyMessage &&
          myMessageConfig.children === 'bottom' &&
          childrenElement}

        {isMyMessage &&
          myMessageConfig.checkMark === 'inside' &&
          checkMarkElement}
      </div>

      {isMyMessage &&
        myMessageConfig.checkMark === 'outside' &&
        checkMarkElement}
    </div>
  )
}
