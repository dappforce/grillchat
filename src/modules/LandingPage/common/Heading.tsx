import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export type HeadingProps = Omit<ComponentProps<'h1'>, 'as'> & {
  as?: React.ElementType
}

export default function Heading({ as = 'h3', ...props }: HeadingProps) {
  const Component = as
  return (
    <Component
      {...props}
      className={cx(
        'text-balance text-center text-3xl font-bold sm:text-4xl lg:text-5xl',
        props.className
      )}
    />
  )
}
