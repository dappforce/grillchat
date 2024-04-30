import { cx } from '@/utils/class-names'
import {
  generatePolymorphicComponent,
  PolymorphicProps,
  PolymorphicTypes,
} from '@/utils/generator/polymorphic'
import { forwardRef } from 'react'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const BaseContainer = generatePolymorphicComponent(
  cx('relative mx-auto w-full max-w-screen-md px-3')
)

const Container: typeof BaseContainer = forwardRef(function Container(
  props,
  ref
) {
  return (
    <BaseContainer
      {...props}
      className={cx((props as any).className, 'max-w-screen-xl')}
      ref={ref}
    />
  )
}) as any

export default Container
