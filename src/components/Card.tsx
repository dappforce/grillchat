import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

const cardStyles = cva('rounded-2xl bg-background-lighter', {
  variants: {
    size: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'p-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardStyles>

export default function Card({ size, ...props }: CardProps) {
  return (
    <div {...props} className={cx(cardStyles({ size }), props.className)} />
  )
}
