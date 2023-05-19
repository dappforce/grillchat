import Button from '@/components/Button'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { getEmojiAmount, isTextContainsOnlyEmoji } from '@/utils/strings'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import RepliedMessagePreview from '../RepliedMessagePreview'
import { ChatItemContentProps } from './types'

export type EmojiChatItemProps = ChatItemContentProps

const EMOJI_FONT_SIZE = {
  min: 32,
  max: 80,
}
const MAX_EMOJI_AMOUNT = 3

export function shouldRenderEmojiChatItem(body: string) {
  return (
    isTextContainsOnlyEmoji(body) && getEmojiAmount(body) <= MAX_EMOJI_AMOUNT
  )
}

export default function EmojiChatItem({
  isMyMessage,
  isSent,
  onCheckMarkClick,
  body,
  relativeTime,
  senderColor,
  ownerId,
  inReplyTo,
  scrollToMessage,
  ...props
}: EmojiChatItemProps) {
  const emojiCount = getEmojiAmount(body)

  const emojiDiff = EMOJI_FONT_SIZE.max - EMOJI_FONT_SIZE.min
  const emojiFontIncrement = emojiDiff / (MAX_EMOJI_AMOUNT - 1)
  const emojiFontSize =
    EMOJI_FONT_SIZE.min + emojiFontIncrement * (MAX_EMOJI_AMOUNT - emojiCount)

  const name = generateRandomName(ownerId)

  return (
    <div
      className={cx(
        'flex flex-col gap-1 overflow-hidden',
        isMyMessage ? 'items-end' : 'items-start',
        props.className
      )}
    >
      {!isMyMessage && (
        <div className='flex items-center pl-1'>
          <span
            className='mr-2 text-sm text-text-secondary'
            style={{ color: senderColor }}
          >
            {name}
          </span>
          <span className='text-xs text-text-muted'>{relativeTime}</span>
        </div>
      )}
      <div
        className={cx(
          'flex w-full gap-2 overflow-hidden',
          isMyMessage ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <p
          className={cx('flex items-center')}
          style={{
            fontSize: emojiFontSize,
          }}
        >
          {body}
        </p>
        <div
          className={cx(
            isMyMessage ? 'items-end' : 'items-start',
            'flex flex-col gap-4 overflow-hidden py-2'
          )}
        >
          {inReplyTo?.id && (
            <div className='w-full overflow-hidden rounded-xl bg-background-light py-2 px-2.5'>
              <RepliedMessagePreview
                originalMessage={body}
                repliedMessageId={inReplyTo.id}
                scrollToMessage={scrollToMessage}
              />
            </div>
          )}
        </div>
      </div>
      {isMyMessage && (
        <div className='mt-auto flex items-center gap-1 rounded-2xl px-2.5 pb-1.5'>
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
  )
}
