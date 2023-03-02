import { RefObject, useEffect, useState } from 'react'

export default function useIsAtBottom(
  containerRef: RefObject<HTMLElement | null>,
  offset = 0
) {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const scrollListener = () => {
      if (!container) return
      // because the chat is using flex direction column-reverse, the scroll top is negative
      setIsAtBottom(container.scrollTop >= -offset)
    }
    scrollListener()
    container?.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      container?.removeEventListener('scroll', scrollListener)
    }
  }, [containerRef, offset])

  return isAtBottom
}
