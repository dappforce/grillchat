import Button, { ButtonProps } from '@/components/Button'
import { cx } from '@/utils/class-names'
import { RefObject, useEffect } from 'react'
import { HiOutlineChevronDown } from 'react-icons/hi2'
import useAnyNewData from './hooks/useAnyNewData'
import useIsAtBottom from './hooks/useIsAtBottom'

export type NewMessageNoticeProps = ButtonProps & {
  scrollContainerRef: RefObject<HTMLDivElement | null>
  messageIds: string[]
}

const IS_AT_BOTTOM_OFFSET = 300

export function NewMessageNotice({
  scrollContainerRef,
  messageIds,
  ...props
}: NewMessageNoticeProps) {
  const isAtBottom = useIsAtBottom(scrollContainerRef, IS_AT_BOTTOM_OFFSET)
  const { anyNewData, clearAnyNewData } = useAnyNewData(messageIds)

  useEffect(() => {
    if (isAtBottom) clearAnyNewData()
  }, [clearAnyNewData, isAtBottom, anyNewData])

  if (isAtBottom) return null

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
      interactive='brightness-only'
      size='circle'
      {...props}
      className={cx('relative bg-background-light p-2.5', props.className)}
    >
      {anyNewData ? (
        <span className='absolute -top-1 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background-primary py-0.5 px-2 text-sm text-text-on-primary'>
          {anyNewData}
        </span>
      ) : null}
      <HiOutlineChevronDown className='relative top-px text-xl' />
    </Button>
  )
}
