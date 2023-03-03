import Button, { ButtonProps } from '@/components/Button'
import { cx } from '@/utils/className'
import { RefObject, useEffect } from 'react'
import { BsChevronDown } from 'react-icons/bs'
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
      size='circle'
      {...props}
      className={cx('relative bg-background-light p-3', props.className)}
    >
      <span className='absolute -top-1 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background-primary py-0.5 px-2 text-sm'>
        {anyNewData}
      </span>
      <BsChevronDown className='relative top-px text-2xl' />
    </Button>
  )
}
