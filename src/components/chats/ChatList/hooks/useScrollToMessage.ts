import { scrollToMessageElement } from '../../helpers'
import useGetMessageElement from './useGetChatElement'

export default function useScrollToMessage(
  scrollContainerRef: React.RefObject<HTMLElement>,
  getMessageElementArgs: Parameters<typeof useGetMessageElement>[0],
  loadMoreController: { pause: () => void; unpause: () => void }
) {
  const getElement = useGetMessageElement(getMessageElementArgs)

  return async (chatId: string, shouldHighlight = true) => {
    const element = await getElement(chatId)
    if (!element) return

    loadMoreController.pause()
    await scrollToMessageElement(
      element,
      scrollContainerRef.current,
      shouldHighlight
    )
    loadMoreController.unpause()
  }
}
