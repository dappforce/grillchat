import truncate from 'lodash.truncate'

export function truncateText(text: string, length: number) {
  return truncate(text, { length })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function isTextContainsOnlyEmoji(text: string) {
  const emojiRegex = /\p{Extended_Pictographic}/gu
  const isOnlyEmoji = text.replace(emojiRegex, '').trim().length === 0
  return isOnlyEmoji
}

export function getEmojiAmount(text: string) {
  const emojiRegex = /\p{Extended_Pictographic}/gu
  const emojiAmount = text.match(emojiRegex)?.length ?? 0
  return emojiAmount
}
