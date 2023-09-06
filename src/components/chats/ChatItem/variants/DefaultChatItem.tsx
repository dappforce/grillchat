import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import { cx } from '@/utils/class-names'
import Linkify from 'linkify-react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import ChatRelativeTime from '../ChatRelativeTime'
import LinkPreview from '../LinkPreview'
import RepliedMessagePreview from '../RepliedMessagePreview'
import { ChatItemContentProps } from './types'

export type DefaultChatItemProps = ChatItemContentProps

export default function DefaultChatItem({
  chatId,
  hubId,
  message,
  isMyMessage,
  isSent,
  onCheckMarkClick,
  scrollToMessage,
  ...props
}: DefaultChatItemProps) {
  const messageId = message.id

  const { createdAtTime, ownerId } = message.struct
  const { inReplyTo, body, link, linkMetadata } = message.content || {}

  return (
    <div className={cx('flex flex-col', props.className)}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl px-2.5 py-1.5',
          isMyMessage
            ? 'bg-background-primary-light text-text dark:bg-background-primary dark:text-text-on-primary'
            : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <ProfilePreviewModalName
              messageId={messageId}
              address={ownerId}
              className={cx('mr-2 text-sm text-text-secondary')}
            />
            <ChatRelativeTime
              createdAtTime={createdAtTime}
              className='text-xs text-text-muted'
            />
          </div>
        )}
        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body ?? ''}
            className='my-1'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
            chatId={chatId}
            hubId={hubId}
          />
        )}
        <p className='whitespace-pre-wrap break-words text-base'>
          <Linkify
            options={{
              render: ({ content, attributes }) => (
                <LinkText
                  {...attributes}
                  href={attributes.href}
                  variant={isMyMessage ? 'secondary-light' : 'secondary'}
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
        {link && (
          <LinkPreview
            renderNullIfLinkEmbedable
            className={cx('my-1')}
            link={link}
            linkMetadata={linkMetadata}
            isMyMessage={isMyMessage}
          />
        )}
        {isMyMessage && (
          <div
            className={cx('flex items-center gap-1', isMyMessage && 'self-end')}
          >
            <ChatRelativeTime
              createdAtTime={createdAtTime}
              className='text-xs text-text-muted dark:text-text-muted-on-primary'
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
                  className={cx(
                    'text-sm text-text-muted dark:text-text-muted-on-primary'
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
