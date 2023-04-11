import { getChatItemId } from '../helpers'

export default function useGetChatElement(
  rootPostId: string,
  loadMore: () => void
) {
  const getChatElement = async (postId: string) => {
    const elementId = getChatItemId(postId)
    const element = document.getElementById(elementId)
    if (element) return element
  }

  return getChatElement
}
