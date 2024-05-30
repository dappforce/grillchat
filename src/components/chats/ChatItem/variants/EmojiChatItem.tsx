import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import SuperLike from '@/components/content-staking/SuperLike'
import { cx } from '@/utils/class-names'
import { getEmojiAmount, validateTextContainsOnlyEmoji } from '@/utils/strings'
import { getRepliedMessageId } from '../../utils'
import ChatRelativeTime from '../ChatRelativeTime'
import MessageStatusIndicator from '../MessageStatusIndicator'
import RepliedMessagePreview from '../RepliedMessagePreview'
import SubTeamLabel from '../SubTeamLabel'
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
  scrollToMessage,
  chatId,
  hubId,
  ...props
}: EmojiChatItemProps) {
  const messageId = message.id

  const { createdAtTime, ownerId, isUpdated } = message.struct
  const { body } = message.content || {}

  const repliedMessageId = getRepliedMessageId(message)

  const emojiCount = getEmojiAmount(body ?? '')

  const emojiDiff = EMOJI_FONT_SIZE.max - EMOJI_FONT_SIZE.min
  const emojiFontIncrement = emojiDiff / (MAX_EMOJI_AMOUNT - 1)
  const emojiFontSize =
    EMOJI_FONT_SIZE.min + emojiFontIncrement * (MAX_EMOJI_AMOUNT - emojiCount)

  const relativeTimeElement = (
    <ChatRelativeTime
      isUpdated={isUpdated}
      createdAtTime={createdAtTime}
      className='flex-shrink-0 text-xs text-text-muted'
    />
  )

  return (
    <div
      className={cx(
        'flex flex-col gap-1',
        isMyMessage ? 'items-end' : 'items-start',
        props.className
      )}
    >
      {!isMyMessage && (
        <div className='flex items-baseline justify-between gap-2 overflow-hidden pl-1'>
          <ProfilePreviewModalName
            clipText
            showModeratorChip
            labelingData={{ chatId }}
            messageId={messageId}
            address={ownerId}
            className={cx('mr-2 text-sm font-medium text-text-secondary')}
          />
          <SubTeamLabel address={ownerId} className='!bg-background-light/50' />
        </div>
      )}
      <div
        className={cx(
          'relative flex w-full gap-2',
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
          {repliedMessageId && (
            <div className='w-full overflow-hidden rounded-xl bg-background-light px-2.5 py-2'>
              <RepliedMessagePreview
                originalMessage={body ?? ''}
                repliedMessageId={repliedMessageId}
                scrollToMessage={scrollToMessage}
                chatId={chatId}
                hubId={hubId}
              />
            </div>
          )}
        </div>
        {!isMyMessage && (
          <div
            className={cx(
              'absolute bottom-0 right-0 translate-x-full',
              repliedMessageId && '-right-1'
            )}
          >
            {relativeTimeElement}
          </div>
        )}
      </div>
      {isMyMessage && (
        <div className='mt-auto flex items-center gap-1 rounded-2xl px-2.5 pb-1.5'>
          {relativeTimeElement}
          <MessageStatusIndicator message={message} />
        </div>
      )}
      <SuperLike
        isMyMessage={isMyMessage}
        withPostReward
        className={cx(
          !isMyMessage && 'mt-1.5',
          isMyMessage && 'flex-row-reverse'
        )}
        postId={messageId}
      />
    </div>
  )
}
