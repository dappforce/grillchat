import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  text: string
  alignment: 'left' | 'right'
  // commentId: string
}

export default function ChatItem({
  text,
  alignment,
  // commentId,
  ...props
}: ChatItemProps) {
  // const isMyMessage = alignment === 'right'
  const isMyMessage = false
  const isSent = true

  console.log(text)

  return (
    <div
      {...props}
      className={cx(
        'flex items-start justify-start gap-2',
        isMyMessage && 'flex-row-reverse',
        props.className
      )}
    >
      {!isMyMessage && (
        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background-light'>
          A
        </div>
      )}
      <div
        className={cx(
          'relative flex flex-col gap-0.5 rounded-3xl py-2 px-4',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <span className='mr-2 text-sm text-text-primary'>
              5D4cYH...FAaki5
            </span>
            <span className='text-xs text-text-muted'>2 days</span>
          </div>
        )}
        <p>{text}</p>
        {isMyMessage && (
          <div className='flex items-center gap-1'>
            <span className='text-xs text-text-muted'>12:32</span>
            {isSent ? (
              <IoCheckmarkDoneOutline className='text-sm' />
            ) : (
              <IoCheckmarkOutline className={cx('text-sm text-text-muted')} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
