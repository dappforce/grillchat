import FloatingWrapper from '@/components/floating/FloatingWrapper'
import useRerender from '@/hooks/useRerender'
import { cx } from '@/utils/class-names'
import { formatDate, getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps, useEffect, useState } from 'react'
import { useChatListContext } from '../ChatList'

export type ChatRelativeTimeProps = ComponentProps<'span'> & {
  createdAtTime: string | number
}

export default function ChatRelativeTime({
  createdAtTime,
  ...props
}: ChatRelativeTimeProps) {
  const rerender = useRerender()

  const scrollContainerRef = useChatListContext()
  const [openDetail, setOpenDetail] = useState(false)

  useEffect(() => {
    const REFRESH_INTERVAL = 60 * 1000 * 3 // 3 minutes
    const intervalId = setInterval(() => {
      rerender()
    }, REFRESH_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [rerender])

  useEffect(() => {
    const container = scrollContainerRef?.current
    if (!container) return

    const listener = () => setOpenDetail(false)
    container.addEventListener('scroll', listener, {
      passive: true,
    })
    return () => container?.removeEventListener('scroll', listener)
  }, [scrollContainerRef])

  const relativeTime = getTimeRelativeToNow(createdAtTime)

  return (
    <FloatingWrapper
      allowedPlacements={['left', 'right']}
      mainAxisOffset={4}
      manualMenuController={{ onOpenChange: setOpenDetail, open: openDetail }}
      panel={() => (
        <div className='rounded-md border border-background-lighter bg-background-light px-1.5 py-1 text-xs'>
          {formatDate(createdAtTime)}
        </div>
      )}
      showOnHover
    >
      {({ referenceProps, onClick }) => (
        <span
          {...props}
          {...referenceProps}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.(e)
          }}
          className={cx('text-xs', props.className)}
        >
          {relativeTime}
        </span>
      )}
    </FloatingWrapper>
  )
}
