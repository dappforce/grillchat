import { cx } from '@/utils/class-names'
import {
  generatePolymorphicComponent,
  PolymorphicProps,
  PolymorphicTypes,
} from '@/utils/generator/polymorphic'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const Container = generatePolymorphicComponent(
  cx('relative mx-auto w-full max-w-screen-xl px-3')
)

export default Container
