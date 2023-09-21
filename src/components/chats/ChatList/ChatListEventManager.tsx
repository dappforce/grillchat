import useIsInIframe from '@/hooks/useIsInIframe'
import { useSendEvent } from '@/stores/analytics'
import { debounce } from '@/utils/general'
import { useEffect } from 'react'
import { useChatListContext } from './ChatList'

export default function ChatListEventManager() {
  const containerRef = useChatListContext()
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const listener = debounce(() => {
      sendEvent('read_chat', { eventSource: 'click' })
    }, 500)
    container.addEventListener('click', listener)

    return () => container.removeEventListener('click', listener)
  }, [containerRef, sendEvent])

  useEffect(() => {
    if (!isInIframe) return
    const container = containerRef?.current
    if (!container) return

    const listener = () => {
      sendEvent('read_chat', { eventSource: 'mouse_enter' })
    }
    container.addEventListener('mouseenter', listener, { once: true })

    return () => container.removeEventListener('scroll', listener)
  }, [isInIframe, containerRef, sendEvent])

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const debouncedListener = debounce(() => {
      sendEvent('read_chat', { eventSource: 'scroll' })
    }, 500)
    container.addEventListener('scroll', debouncedListener, { passive: true })
    return () => container.removeEventListener('scroll', debouncedListener)
  }, [containerRef, sendEvent])

  return null
}
