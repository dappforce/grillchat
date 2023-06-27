import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ChatTopNoticeProps = ComponentProps<'div'> & {
  hasNoMessage?: boolean
}

export default function ChatTopNotice({
  hasNoMessage,
  ...props
}: ChatTopNoticeProps) {
  return (
    <div {...props} className={cx('flex justify-center', props.className)}>
      <span className='text-sm text-text-muted'>
        {hasNoMessage
          ? 'No messages here yet'
          : 'You have reached the first message in this chat!'}
      </span>
    </div>
  )
}
