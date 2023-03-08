import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import Container, { ContainerProps } from '../Container'

export type NavbarExtensionProps = ComponentProps<'div'> & {
  contentContainerProps?: ContainerProps<'div'>
}

export default function NavbarExtension({
  contentContainerProps,
  ...props
}: NavbarExtensionProps) {
  return (
    <div
      {...props}
      className={cx(
        'sticky top-14 z-10 border-b border-border-gray bg-background-light py-2',
        props.className
      )}
    >
      <Container {...contentContainerProps}>{props.children}</Container>
    </div>
  )
}
