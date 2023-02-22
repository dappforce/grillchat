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
      <div className='relative rounded-xl bg-background-light py-2 px-4 shadow'>
        <div>{text}</div>
      </div>
    </div>
  )
}
