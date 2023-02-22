import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import Container from './Container'

export type NavbarExtensionProps = ComponentProps<'div'>

export default function NavbarExtension({ ...props }: NavbarExtensionProps) {
  return (
    <div
      {...props}
      className={cx(
        'sticky top-14 border-b border-border-gray bg-background-light py-2',
        props.className
      )}
    >
      <Container>{props.children}</Container>
    </div>
  )
}
