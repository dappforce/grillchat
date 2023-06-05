import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Name from '@/components/Name'
import { getEvmAddressQuery } from '@/services/subsocial/evmAddresses'
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
  inReplyTo,
  scrollToMessage,
  ...props
}: DefaultChatItemProps) {
  const { data: accountData } = getEvmAddressQuery.useQuery(ownerId)

  const { ensName } = accountData || {}
  const name = ensName ? ensName : generateRandomName(ownerId)

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
            <Name ownerId={ownerId} senderColor={senderColor} />
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}
        {inReplyTo && (
          <RepliedMessagePreview
            originalMessage={body}
            className='mt-1'
            repliedMessageId={inReplyTo.id}
            scrollToMessage={scrollToMessage}
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
