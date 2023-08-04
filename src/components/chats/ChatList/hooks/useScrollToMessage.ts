import {
  scrollToMessageElement,
  ScrollToMessageElementConfig,
} from '../../utils'
import useGetMessageElement from './useGetChatElement'

export type ScrollToMessage = ReturnType<typeof useScrollToMessage>
export default function useScrollToMessage(
  scrollContainerRef: React.RefObject<HTMLElement>,
  getMessageElementArgs: Parameters<typeof useGetMessageElement>[0],
  loadMoreController: { pause: () => void; unpause: () => void }
) {
  const getElement = useGetMessageElement(getMessageElementArgs)

  return async (chatId: string, config?: ScrollToMessageElementConfig) => {
    const element = await getElement(chatId)
    if (!element) return

    loadMoreController.pause()
    await scrollToMessageElement(element, scrollContainerRef.current, config)
    loadMoreController.unpause()
  }
}
