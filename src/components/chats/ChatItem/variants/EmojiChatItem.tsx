import Button from '@/components/Button'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import { cx } from '@/utils/class-names'
import { getEmojiAmount, validateTextContainsOnlyEmoji } from '@/utils/strings'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import ChatRelativeTime from '../ChatRelativeTime'
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
    validateTextContainsOnlyEmoji(body) &&
    getEmojiAmount(body) <= MAX_EMOJI_AMOUNT
  )
}

export default function EmojiChatItem({
  message,
  isMyMessage,
  isSent,
  onCheckMarkClick,
  scrollToMessage,
  chatId,
  hubId,
  ...props
}: EmojiChatItemProps) {
  const messageId = message.id

  const { createdAtTime, ownerId } = message.struct
  const { inReplyTo, body } = message.content || {}

  const emojiCount = getEmojiAmount(body ?? '')

  const emojiDiff = EMOJI_FONT_SIZE.max - EMOJI_FONT_SIZE.min
  const emojiFontIncrement = emojiDiff / (MAX_EMOJI_AMOUNT - 1)
  const emojiFontSize =
    EMOJI_FONT_SIZE.min + emojiFontIncrement * (MAX_EMOJI_AMOUNT - emojiCount)

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
      <div
        className={cx(
          'flex w-full gap-2 overflow-hidden',
          isMyMessage ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <p
          className={cx('flex items-center whitespace-nowrap')}
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
            <div className='w-full overflow-hidden rounded-xl bg-background-light px-2.5 py-2'>
              <RepliedMessagePreview
                originalMessage={body ?? ''}
                repliedMessageId={inReplyTo.id}
                scrollToMessage={scrollToMessage}
                chatId={chatId}
                hubId={hubId}
              />
            </div>
          )}
        </div>
      </div>
      {isMyMessage && (
        <div className='mt-auto flex items-center gap-1 rounded-2xl px-2.5 pb-1.5'>
          <ChatRelativeTime
            className='text-xs text-text-muted'
            createdAtTime={createdAtTime}
          />
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
