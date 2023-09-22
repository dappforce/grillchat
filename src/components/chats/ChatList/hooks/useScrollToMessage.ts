import useWrapInRef from '@/hooks/useWrapInRef'
import { useCallback } from 'react'
import {
  scrollToMessageElement,
  ScrollToMessageElementConfig,
} from '../../utils'
import useGetMessageElement from './useGetChatElement'

export type ScrollToMessage = ReturnType<typeof useScrollToMessage>
export default function useScrollToMessage(
  scrollContainerRef: React.RefObject<HTMLElement>,
  getMessageElementArgs: Parameters<typeof useGetMessageElement>[0],
  loadMoreController: { pause: () => void; unpause: () => void },
  defaultScrollConfig?: ScrollToMessageElementConfig
) {
  const getElement = useGetMessageElement(getMessageElementArgs)

  const defaultConfigRef = useWrapInRef(defaultScrollConfig)
  const loadMoreControllerRef = useWrapInRef(loadMoreController)
  return useCallback(
    async (messageId: string, config?: ScrollToMessageElementConfig) => {
      const element = await getElement(messageId)
      if (!element) return

      loadMoreControllerRef.current.pause()
      await scrollToMessageElement(element, scrollContainerRef.current, {
        ...defaultConfigRef.current,
        ...config,
      })
      loadMoreControllerRef.current.unpause()
    },
    [getElement, loadMoreControllerRef, scrollContainerRef, defaultConfigRef]
  )
}
