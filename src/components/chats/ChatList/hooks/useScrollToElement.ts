import { scrollToChatItem } from '../../helpers'
import useGetChatElement from './useGetChatElement'

export default function useScrollToChatElement(
  scrollContainerRef: React.RefObject<HTMLElement>,
  getChatElementArgs: Parameters<typeof useGetChatElement>[0],
  loadMoreController: { pause: () => void; unpause: () => void }
) {
  const getElement = useGetChatElement(getChatElementArgs)

  return async (chatId: string, shouldHighlight = true) => {
    const element = await getElement(chatId)
    if (!element) return

    loadMoreController.pause()
    await scrollToChatItem(element, scrollContainerRef.current, shouldHighlight)
    loadMoreController.unpause()
  }
}
