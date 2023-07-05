import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type DotBlinkingNotificationProps = ComponentProps<'div'>

export default function DotBlinkingNotification({
  ...props
}: DotBlinkingNotificationProps) {
  return (
    <span {...props} className={cx('relative block h-2 w-2', props.className)}>
      <span className='absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-background-warning opacity-75'></span>
      <span className='relative block h-full w-full rounded-full bg-background-warning' />
    </span>
  )
}
