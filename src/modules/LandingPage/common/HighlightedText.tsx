import { cx } from '@/utils/class-names'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps } from 'react'

const highlightedTextVariants = cva(
  'absolute -left-4 -top-1 h-[calc(100%_+_0.5rem)] w-[calc(100%_+_2rem)] -rotate-1 rounded-2xl bg-[#02AE48]',
  {
    variants: {
      size: {
        sm: 'h-[calc(100%)] w-[calc(100%_+_1rem)] -left-2 top-px',
        md: 'h-[calc(100%_+_0.5rem)] w-[calc(100%_+_2rem)] -left-4 -top-1',
      },
      rotate: {
        1: '-rotate-1',
        3: '-rotate-3',
      },
    },
    defaultVariants: {
      size: 'md',
      rotate: 1,
    },
  }
)

export type HighlightedTextProps = Omit<ComponentProps<'span'>, 'size'> &
  VariantProps<typeof highlightedTextVariants>

export default function HighlightedText({
  size,
  children,
  rotate,
  ...props
}: HighlightedTextProps) {
  return (
    <span {...props} className={cx('relative', props.className)}>
      <span className={cx(highlightedTextVariants({ size, rotate }))} />
      <span className='relative'>{children}</span>
    </span>
  )
}
