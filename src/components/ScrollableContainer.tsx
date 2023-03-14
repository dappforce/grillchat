import { scrollBarStyles } from '@/utils/class-names'
import {
  generatePolymorphicComponent,
  PolymorphicProps,
  PolymorphicTypes,
} from '@/utils/generator/polymorphic'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const ScrollableContainer = generatePolymorphicComponent(scrollBarStyles())
export default ScrollableContainer
