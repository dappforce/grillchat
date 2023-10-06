import { waitStopScrolling } from '@/utils/window'

export function getMessageElementId(messageId: string) {
  return `message-${messageId}`
}

export type ScrollToMessageElementConfig = {
  shouldHighlight?: boolean
  smooth?: boolean
  scrollOffset?: 'normal' | 'large'
}
export async function scrollToMessageElement(
  element: HTMLElement | null,
  scrollContainer: HTMLElement | null,
  config?: ScrollToMessageElementConfig
) {
  if (!element || !scrollContainer) return
  const usedConfig = {
    shouldHighlight: true,
    smooth: true,
    scrollOffset: 'normal',
    ...config,
  }

  const y = element.getBoundingClientRect().top
  const offset = usedConfig.scrollOffset === 'normal' ? -72 : -128
  scrollContainer.scrollTo({
    top: y + scrollContainer.scrollTop + offset,
    behavior: usedConfig?.smooth ? 'smooth' : 'auto',
  })
  await waitStopScrolling(scrollContainer)
  if (usedConfig?.shouldHighlight) {
    element.classList.add('highlighted')
    element.onanimationend = function () {
      element.classList.remove('highlighted')
    }
  }
}
