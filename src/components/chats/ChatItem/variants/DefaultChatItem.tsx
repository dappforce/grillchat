import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
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
  isEdited,
  isEditing,
  inReplyTo,
  scrollContainer,
  getRepliedElement,
  ...props
}: DefaultChatItemProps) {
  const name = generateRandomName(ownerId)
  const editedLabel = (isEditing || isEdited) && (
    <span className='text-xs text-text-muted'>
      {isEditing ? 'editing' : 'edited'}
    </span>
  )

  return (
    <div className={cx('flex flex-col', props.className)}>
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl py-1.5 px-2.5',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center gap-1'>
            <span
              className='mr-1 text-sm text-text-secondary'
              style={{ color: senderColor }}
            >
              {name}
            </span>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
            {editedLabel}
          </div>
        )}
        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body}
            className='mt-1'
            repliedMessageId={inReplyTo.id}
            scrollContainer={scrollContainer}
            getRepliedElement={getRepliedElement}
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
            {editedLabel}
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
