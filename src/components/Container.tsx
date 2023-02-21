import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type ContainerProps = ComponentProps<'div'>

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={cx(
        'relative mx-auto w-full px-2 xl:container md:px-6 2xl:max-w-screen-xl',
        className
      )}
    />
  )
}
