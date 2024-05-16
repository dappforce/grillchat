import { cx } from '@/utils/class-names'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps } from 'react'

const highlightedTextVariants = cva(
  'absolute -left-4 -top-1 h-[calc(100%_+_0.5rem)] w-[calc(100%_+_2rem)] -rotate-1 bg-[#02AE48]',
  {
    variants: {
      size: {
        xs: 'h-[calc(100%)] w-[calc(100%_+_0.5rem)] -left-1 top-px',
        sm: 'h-[calc(100%)] w-[calc(100%_+_1rem)] -left-2 top-px',
        md: 'h-[calc(100%_+_0.5rem)] w-[calc(100%_+_2rem)] -left-4 -top-1',
      },
      rotate: {
        1: '-rotate-1',
        3: '-rotate-3',
      },
      roundings: {
        lg: 'rounded-lg',
        '2xl': 'rounded-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
      rotate: 1,
      roundings: '2xl',
    },
  }
)

export type HighlightedTextProps = Omit<ComponentProps<'span'>, 'size'> &
  VariantProps<typeof highlightedTextVariants>

export default function HighlightedText({
  size,
  children,
  rotate,
  roundings,
  ...props
}: HighlightedTextProps) {
  return (
    <span {...props} className={cx('relative inline-block', props.className)}>
      <span
        className={cx(highlightedTextVariants({ size, rotate, roundings }))}
      />
      <span className='relative'>{children}</span>
    </span>
  )
}
