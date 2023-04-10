import truncate from 'lodash.truncate'

export function truncateText(text: string, length: number) {
  return truncate(text, { length })
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
