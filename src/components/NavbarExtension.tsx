import { cx } from '@/utils/className'
import { ComponentProps } from 'react'

export type NavbarExtensionProps = ComponentProps<'div'>

export default function NavbarExtension({ ...props }: NavbarExtensionProps) {
  return (
    <div {...props} className={cx('sticky top-14', props.className)}>
      {props.children}
    </div>
  )
}
