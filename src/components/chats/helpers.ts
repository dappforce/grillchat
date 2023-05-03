import { waitStopScrolling } from '@/utils/window'

export function getMessageElementId(postId: string) {
  return `message-${postId}`
}

export async function scrollToMessageElement(
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
