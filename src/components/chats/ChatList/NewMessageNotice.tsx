import Button, { ButtonProps } from '@/components/Button'
import { cx } from '@/utils/className'
import { RefObject, useEffect } from 'react'
import { IoReturnUpForward } from 'react-icons/io5'
import useAnyNewData from './hooks/useAnyNewData'
import useIsAtBottom from './hooks/useIsAtBottom'

export type NewMessageNoticeProps = ButtonProps & {
  scrollContainerRef: RefObject<HTMLDivElement | null>
  commentIds: string[]
}

export function NewMessageNotice({
  scrollContainerRef,
  commentIds,
  ...props
}: NewMessageNoticeProps) {
  const isAtBottom = useIsAtBottom(scrollContainerRef, 100)
  const { anyNewData, clearAnyNewData } = useAnyNewData(commentIds)

  useEffect(() => {
    if (isAtBottom) clearAnyNewData()
  }, [clearAnyNewData, isAtBottom, anyNewData])

  if (!anyNewData || isAtBottom) return null

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current?.scrollHeight,
      behavior: 'smooth',
    })
    clearAnyNewData()
  }

  return (
    <Button
      variant='transparent'
      onClick={scrollToBottom}
      withRingInteraction={false}
      {...props}
      className={cx(
        'relative cursor-pointer rounded-lg bg-background-light px-4 py-2',
        props.className
      )}
    >
      <div className='flex items-center justify-center gap-2 overflow-hidden text-text-muted'>
        <span className='text-sm'>
          {anyNewData} new message{anyNewData > 1 ? 's' : ''}
        </span>
        <IoReturnUpForward className='rotate-90' />
        <div className='absolute top-0 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2'>
          <div className='absolute inset-0 h-full w-full animate-ping rounded-full bg-background-primary' />
          <div className='absolute inset-0 h-full w-full rounded-full bg-background-primary' />
        </div>
      </div>
    </Button>
  )
}
