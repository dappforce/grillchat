import FloatingWrapper from '@/components/floating/FloatingWrapper'
import { formatDate, getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps } from 'react'

export type ChatRelativeTimeProps = ComponentProps<'span'> & {
  createdAtTime: string | number
}

export default function ChatRelativeTime({
  createdAtTime,
}: ChatRelativeTimeProps) {
  const relativeTime = getTimeRelativeToNow(createdAtTime)

  return (
    <FloatingWrapper
      allowedPlacements={['left', 'right']}
      mainAxisOffset={4}
      panel={() => (
        <div className='rounded-md border border-background-lighter bg-background-light px-1.5 py-1 text-xs'>
          {formatDate(createdAtTime)}
        </div>
      )}
      showOnHover
    >
      {({ referenceProps }) => (
        <span {...referenceProps} className='text-xs text-text-muted'>
          {relativeTime}
        </span>
      )}
    </FloatingWrapper>
  )
}
