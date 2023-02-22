import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  text: string
  alignment: 'left' | 'right'
}

export default function ChatItem({ text, alignment, ...props }: ChatItemProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex items-start justify-start gap-2',
        alignment === 'right' && 'flex-row-reverse',
        props.className
      )}
    >
      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background-light'>
        A
      </div>
      <div className='relative flex flex-col rounded-3xl bg-background-light py-2 px-4'>
        <div className='flex items-center'>
          <span className='mr-2 text-sm text-text-primary'>
            5D4cYH...FAaki5
          </span>
          <span className='text-xs text-text-muted'>2 days</span>
        </div>
        <p>{text}</p>
      </div>
    </div>
  )
}
