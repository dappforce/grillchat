import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import Sidebar from './Sidebar'

export default function SidebarLayout({
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cx('mx-auto flex max-w-screen-xl', props.className)}
    >
      <Sidebar className={cx('basis-60')} />
      <main>{children}</main>
    </div>
  )
}
