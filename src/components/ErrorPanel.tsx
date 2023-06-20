import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type ErrorPanelProps = ComponentProps<'div'>

export default function ErrorPanel({ ...props }: ErrorPanelProps) {
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
