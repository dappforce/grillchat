import { cx } from '@/utils/className'
import { generatePolymorphicComponent } from '@/utils/generator/polymorphic'
import { PolymorphicProps, PolymorphicTypes } from '@/utils/types'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const ScrollableContainer = generatePolymorphicComponent(
  cx('flex-1 overflow-auto')
)
export default ScrollableContainer
