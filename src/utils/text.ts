export function truncateText(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length)}...` : text
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
