import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatTopNoticeProps = ComponentProps<'div'> & {
  label?: string
}

export default function ChatTopNotice({ label, ...props }: ChatTopNoticeProps) {
  return (
    <div {...props} className={cx('flex justify-center', props.className)}>
      <span className='text-center text-sm text-text-muted'>
        {label ? label : 'You have reached the first message in this chat!'}
      </span>
    </div>
  )
}
