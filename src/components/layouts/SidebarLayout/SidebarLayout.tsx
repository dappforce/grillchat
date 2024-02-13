import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import RightSidebar from './RightSidebar'
import Sidebar from './Sidebar'

export default function SidebarLayout({
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cx('mx-auto flex max-w-screen-xl px-4', props.className)}
    >
      <Sidebar className={cx('basis-60')} />
      <main className='flex-1'>{children}</main>
      <RightSidebar className={cx('basis-[21rem]')} />
    </div>
  )
}
