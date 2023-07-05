import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type CardProps = ComponentProps<'div'>

export default function Card({ ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cx('rounded-2xl bg-background-lighter p-4', props.className)}
    />
  )
}
