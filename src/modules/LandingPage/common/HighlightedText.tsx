import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type HighlightedTextProps = ComponentProps<'span'>

export default function HighlightedText({
  children,
  ...props
}: HighlightedTextProps) {
  return (
    <span {...props} className={cx('relative', props.className)}>
      <span className='absolute -left-4 -top-1 h-[calc(100%_+_0.5rem)] w-[calc(100%_+_2rem)] -rotate-1 rounded-2xl bg-[#02AE48]' />
      <span className='relative'>{children}</span>
    </span>
  )
}
