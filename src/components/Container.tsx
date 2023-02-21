import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type ContainerProps = ComponentProps<'div'>

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={cx('relative mx-auto w-full max-w-screen-md px-2', className)}
    />
  )
}
