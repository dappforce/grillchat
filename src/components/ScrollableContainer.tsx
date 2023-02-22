import { cx } from '@/utils/className'
import { generatePolymorphicComponent } from '@/utils/generator/polymorphic'
import { PolymorphicProps, PolymorphicTypes } from '@/utils/types'

export type ContainerProps<Type extends PolymorphicTypes> =
  PolymorphicProps<Type>

const ScrollableContainer = generatePolymorphicComponent(
  cx(
    'flex-1 overflow-auto pr-4',
    'scrollbar-thin',
    'scrollbar-thumb-background-light scrollbar-track-background-light/50',
    'scrollbar-track-rounded-full scrollbar-thumb-rounded-full'
  )
)
export default ScrollableContainer
