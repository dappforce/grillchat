import truncate from 'lodash.truncate'

export function truncateText(text: string, length: number) {
  return truncate(text, { length })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu
export function isTextContainsOnlyEmoji(text: string) {
  const isOnlyEmoji = text.replace(EMOJI_REGEX, '').trim().length === 0
  return isOnlyEmoji
}
export function getEmojiAmount(text: string) {
  const emojiAmount = text.match(EMOJI_REGEX)?.length ?? 0
  return emojiAmount
}
