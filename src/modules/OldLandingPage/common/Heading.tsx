import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type HeadingProps = Omit<ComponentProps<'h1'>, 'as'> & {
  as?: React.ElementType
  withMargin?: boolean
}

export default function Heading({
  as = 'h3',
  withMargin,
  ...props
}: HeadingProps) {
  const Component = as
  return (
    <Component
      {...props}
      className={cx(
        'text-balance text-center text-3xl font-bold sm:text-4xl lg:text-5xl',
        withMargin && 'mb-6 md:mb-8 lg:mb-10',
        props.className
      )}
    />
  )
}
