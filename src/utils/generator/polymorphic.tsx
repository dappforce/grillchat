import { cx } from '@/utils/className'
import { PolymorphicProps, PolymorphicTypes } from '@/utils/types'

export function generatePolymorphicComponent<AdditionalProps>(
  defaultClassName: string,
  customRenderer?: (props: AdditionalProps) => JSX.Element
) {
  return function PolymorphicComponent<Type extends PolymorphicTypes = 'div'>({
    className,
    as,
    ...props
  }: PolymorphicProps<Type> & AdditionalProps) {
    const Component = as || 'div'

    if (customRenderer) {
      return customRenderer(props as AdditionalProps)
    }

    return (
      <Component {...props} className={cx(defaultClassName, className)}>
        ScrollableContainer
      </Component>
    )
  }
}
