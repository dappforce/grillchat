import type { ComponentProps, JSXElementConstructor } from 'react'

export type PolymorphicTypes = React.ElementType | JSXElementConstructor<any>
export type PolymorphicProps<Type extends PolymorphicTypes> = {
  as?: Type
} & ComponentProps<Type>
