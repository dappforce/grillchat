import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import Linkify from 'linkify-react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import RepliedMessagePreview from '../RepliedMessagePreview'
import { ChatItemContentProps } from './types'

export type DefaultChatItemProps = ChatItemContentProps

export default function DefaultChatItem({
  isMyMessage,
  isSent,
  onCheckMarkClick,
  body,
  ownerId,
  relativeTime,
  senderColor,
  inReplyTo,
  ...props
}: DefaultChatItemProps) {
  return (
    <div className={cx('flex flex-col', props.className)}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl py-1.5 px-2.5',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <span
              className='mr-2 text-sm text-text-secondary'
              style={{ color: senderColor }}
            >
              {truncateAddress(ownerId)}
            </span>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
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
            className={cx('flex items-center gap-1', isMyMessage && 'self-end')}
          >
            <span className='text-xs text-text-muted'>{relativeTime}</span>
            <Button
              variant='transparent'
              size='noPadding'
              interactive='brightness-only'
              onClick={onCheckMarkClick}
            >
              {isSent ? (
                <IoCheckmarkDoneOutline className='text-sm' />
              ) : (
                <IoCheckmarkOutline className={cx('text-sm text-text-muted')} />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
