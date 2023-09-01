import { waitStopScrolling } from '@/utils/window'

export function getMessageElementId(messageId: string) {
  return `message-${messageId}`
}

export type ScrollToMessageElementConfig = {
  shouldHighlight?: boolean
  smooth?: boolean
}
export async function scrollToMessageElement(
  element: HTMLElement | null,
  scrollContainer: HTMLElement | null,
  config: ScrollToMessageElementConfig = {
    shouldHighlight: true,
    smooth: true,
  }
) {
  if (!element || !scrollContainer) return

  const y = element.getBoundingClientRect().top
  const offset = -72
  scrollContainer.scrollTo({
    top: y + scrollContainer.scrollTop + offset,
    behavior: config?.smooth ? 'smooth' : 'auto',
  })
  await waitStopScrolling(scrollContainer)
  if (config?.shouldHighlight) {
    element.classList.add('highlighted')
    element.onanimationend = function () {
      element.classList.remove('highlighted')
    }
  }
}
