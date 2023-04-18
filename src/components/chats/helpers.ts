import { waitStopScrolling } from '@/utils/window'

export function getChatItemId(postId: string) {
  return `chat-item-${postId}`
}

export async function scrollToChatItem(
  element: HTMLElement | null,
  scrollContainer: HTMLElement | null
) {
  if (!element) return

  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await waitStopScrolling(scrollContainer)
  element.classList.add('highlighted')
  element.onanimationend = function () {
    element.classList.remove('highlighted')
  }
}
