import { cx } from '@/utils/class-names'
import { getEmojiAmount } from '@/utils/text'
import { ChatItemContentProps } from './types'

export type EmojiChatItemProps = ChatItemContentProps

const BASE_EMOJI_FONT = 32
const MAX_EMOJI_AMOUNT = 3

export default function EmojiChatItem({
  isMyMessage,
  isSent,
  onCheckMarkClick,
  body,
  ownerId,
  relativeTime,
  senderColor,
  inReplyTo,
  ...props
}: EmojiChatItemProps) {
  const emojiCount = getEmojiAmount(body)

  return (
    <div className={cx('flex', props.className)}>
      <p
        className={cx('flex items-center')}
        style={{
          fontSize: (BASE_EMOJI_FONT * MAX_EMOJI_AMOUNT) / emojiCount,
        }}
      >
        {body}
      </p>
    </div>
  )
}
