import { cx } from '@/utils/className'
import { PolymorphicProps, PolymorphicTypes } from '@/utils/types'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

export default function Container<Type extends PolymorphicTypes>({
  className,
  as,
  ...props
}: ContainerProps<Type>) {
  const Component = as || 'div'

  return (
    <Component
      {...props}
      className={cx('relative mx-auto w-full max-w-screen-md px-2', className)}
    />
  )
}
