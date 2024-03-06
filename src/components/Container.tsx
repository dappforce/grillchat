import { PAGES_WITH_SIDEBAR } from '@/constants/layout'
import { cx } from '@/utils/class-names'
import {
  generatePolymorphicComponent,
  PolymorphicProps,
  PolymorphicTypes,
} from '@/utils/generator/polymorphic'
import { useRouter } from 'next/router'
import { forwardRef } from 'react'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const BaseContainer = generatePolymorphicComponent(
  cx('relative mx-auto w-full max-w-screen-md px-2')
)

const Container: typeof BaseContainer = forwardRef(function Container(
  props,
  ref
) {
  const { pathname } = useRouter()
  if (PAGES_WITH_SIDEBAR.includes(pathname))
    return (
      <BaseContainer
        {...props}
        className={cx((props as any).className, 'max-w-screen-xl')}
        ref={ref}
      />
    )
  return <BaseContainer {...props} ref={ref} />
}) as any

export default Container
