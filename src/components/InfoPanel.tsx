import { cx } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

const infoPanelStyles = cva('rounded-2xl px-4 py-3 text-sm', {
  variants: {
    variant: {
      error: 'bg-background-red text-text-red',
      info: 'bg-[#3B82F61A] text-[#60A5FA]',
    },
  },
  defaultVariants: {
    variant: 'error',
  },
})

export type InfoPanelProps = ComponentProps<'div'> &
  VariantProps<typeof infoPanelStyles>

export default function InfoPanel({ variant, ...props }: InfoPanelProps) {
  return (
    <div
      {...props}
      className={cx(infoPanelStyles({ variant }), props.className)}
    />
  )
}
