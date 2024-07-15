import { useHapticFeedbackRaw } from '@tma.js/sdk-react'
import { useCallback, useRef } from 'react'

interface LongPressOptions {
  shouldPreventDefault?: boolean
  delay?: number
}

const isTouchEvent = (event: Event): event is TouchEvent => {
  return 'touches' in event
}

const preventDefault = (event: Event) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault()
  }
}
const useLongTouch = (
  onLongPress: (e: any) => void,
  { shouldPreventDefault = true, delay = 300 }: LongPressOptions = {},
  animation?: {
    startAnimation: () => void
    endAnimation: () => void
  }
) => {
  const haptic = useHapticFeedbackRaw(true)
  const { startAnimation, endAnimation } = animation || {}

  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const animationTimeout = useRef<ReturnType<typeof setTimeout>>()
  const target = useRef<EventTarget>()

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        preventDefault(event as any)
      }
      target.current = event.target

      animationTimeout.current = setTimeout(() => {
        startAnimation?.()
      }, 100)

      timeout.current = setTimeout(() => {
        onLongPress(event)
        haptic?.result?.impactOccurred('medium')
      }, delay)
    },
    [delay, haptic?.result, onLongPress, shouldPreventDefault, startAnimation]
  )

  const clearAndPreventClick = useCallback(() => {
    timeout.current && clearTimeout(timeout.current)
    animationTimeout.current && clearTimeout(animationTimeout.current)
    // endAnimation?.()
  }, [])

  return {
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseLeave: (e: React.MouseEvent) => clearAndPreventClick(),
    onTouchEnd: (e: React.TouchEvent) => clearAndPreventClick(),
    onTouchMove: (e: React.TouchEvent) => clearAndPreventClick(),
  }
}

export default useLongTouch
