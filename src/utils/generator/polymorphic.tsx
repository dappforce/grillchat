import { cx } from '@/utils/className'
import type { ComponentProps, JSXElementConstructor } from 'react'

export type PolymorphicTypes = React.ElementType | JSXElementConstructor<any>
export type PolymorphicProps<Type extends PolymorphicTypes> = {
  as?: Type
} & Omit<ComponentProps<Type>, 'as'>

export function generatePolymorphicComponent<AdditionalProps>(
  defaultClassName: string,
  customRenderer?: (props: AdditionalProps) => JSX.Element
) {
  return function PolymorphicComponent<Type extends PolymorphicTypes>({
    className,
    as,
    ...props
  }: PolymorphicProps<Type> & AdditionalProps) {
    const Component = as || 'div'

    if (customRenderer) {
      return customRenderer(props as AdditionalProps)
    }

    return <Component {...props} className={cx(defaultClassName, className)} />
  }
}
