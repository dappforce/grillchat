import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatTopNoticeProps = ComponentProps<'div'>

export default function ChatTopNotice({ ...props }: ChatTopNoticeProps) {
  return (
    <div {...props} className={cx('flex justify-center', props.className)}>
      <span className='text-sm text-text-muted'>
        You have reached the first message in this chat!
      </span>
    </div>
  )
}
