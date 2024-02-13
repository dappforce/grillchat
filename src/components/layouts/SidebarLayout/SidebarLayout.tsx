import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import RightSidebar from './RightSidebar'
import Sidebar from './Sidebar'

export default function SidebarLayout({
  children,
  withContentBorder,
  ...props
}: ComponentProps<'div'> & { withContentBorder?: boolean }) {
  return (
    <div
      {...props}
      className={cx('mx-auto flex max-w-screen-xl px-4', props.className)}
    >
      <Sidebar className={cx('basis-60')} />
      <main
        className={cx(
          'flex-1',
          withContentBorder && 'min-h-screen border-x border-border-gray'
        )}
      >
        {children}
      </main>
      <RightSidebar className={cx('basis-[21rem]')} />
    </div>
  )
}
