import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type InfoPanelProps = ComponentProps<'div'>

export default function InfoPanel({ ...props }: InfoPanelProps) {
  return (
    <div
      {...props}
      className={cx(
        'rounded-2xl bg-background-red px-4 py-3 text-text-red',
        props.className
      )}
    />
  )
}
