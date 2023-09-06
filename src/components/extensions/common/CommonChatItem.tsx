import Button from '@/components/Button'
import ChatRelativeTime from '@/components/chats/ChatItem/ChatRelativeTime'
import RepliedMessagePreview from '@/components/chats/ChatItem/RepliedMessagePreview'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import Linkify from 'linkify-react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import { ExtensionChatItemProps } from '../types'

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
  textColor?: string
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
  textColor,
  className,
  isMyMessage: _isMyMessage,
  chatId,
  hubId,
}: CommonChatItemProps) {
  const myAddress = useMyAccount((state) => state.address)
  const { struct, content } = message
  const { ownerId, createdAtTime } = struct
  const { inReplyTo, body } = content || {}

  const isMyMessage = _isMyMessage ?? ownerId === myAddress
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
      <ChatRelativeTime
        createdAtTime={createdAtTime}
        className={cx(
          'text-xs text-text-muted',
          isMyMessage && 'dark:text-text-muted-on-primary'
        )}
      />
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
            <ProfilePreviewModalName
              messageId={message.id}
              address={ownerId}
              color={textColor}
              className={cx('mr-2 text-sm font-medium text-text-secondary')}
            />
            <ChatRelativeTime
              createdAtTime={createdAtTime}
              className='text-xs text-text-muted'
              style={{ color: textColor }}
            />
          </div>
        )}

        {isMyMessage && myMessageConfig.children === 'top' && childrenElement}

        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='mx-2.5 my-1 first:mt-2.5'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
            textColor={textColor}
            chatId={chatId}
            hubId={hubId}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      attributes.onClick?.(e)
                    }}
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
