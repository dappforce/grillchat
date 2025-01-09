import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import BackButton from '../BackButton'
import Navbar, { NavbarProps } from '../navbar/Navbar'
import NavbarExtension from '../navbar/NavbarExtension'
import CreatorSidebar from './CreatorSidebar'
import Sidebar from './Sidebar'

export type DefaultLayoutProps = ComponentProps<'div'> & {
  navbarProps?: NavbarProps
  withBackButton?: LayoutNavbarExtensionProps
  withFixedHeight?: boolean
  withSidebar?: boolean
  withSidebarBorder?: boolean
  withRightSidebar?: boolean
}

export default function DefaultLayout({
  children,
  navbarProps,
  withSidebarBorder = true,
  withBackButton,
  withFixedHeight,
  withSidebar,
  withRightSidebar = false,
  style,
  ...props
}: DefaultLayoutProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex flex-col bg-background text-text',
        withFixedHeight && 'h-screen',
        props.className
      )}
      style={
        withFixedHeight
          ? { height: '100dvh', ...style }
          : { minHeight: '100svh', ...style }
      }
    >
      <Navbar
        {...navbarProps}
        withLargerContainer={withSidebar || navbarProps?.withLargerContainer}
      />
      {withBackButton && <LayoutNavbarExtension {...withBackButton} />}
      {withSidebar ? (
        <div
          className={cx(
            'container-page flex flex-1 items-start border-border-gray !pl-0 !pr-0 md:!pl-4'
          )}
        >
          <div
            className={cx(
              'sticky top-14 hidden h-[calc(100dvh_-_3.5rem)] w-[200px] border-r border-border-gray md:block',
              withSidebarBorder && 'border-r'
            )}
          >
            <Sidebar />
          </div>
          <div className='flex-1'>{children}</div>
          {withRightSidebar && (
            <div
              className={cx(
                'sticky top-14 hidden h-[calc(100dvh_-_3.5rem)] w-[275px] py-4 lg:block'
              )}
            >
              <CreatorSidebar />
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

type LayoutNavbarExtensionProps = {
  title?: string
  isTransparent?: boolean
  defaultBackTo?: string
}
function LayoutNavbarExtension({
  title,
  isTransparent,
  defaultBackTo,
}: LayoutNavbarExtensionProps) {
  const mdUp = useBreakpointThreshold('md')

  return (
    <NavbarExtension
      className={cx(
        'fixed w-full transition',
        isTransparent && 'border-none bg-transparent'
      )}
    >
      <div className='relative flex h-8 items-center justify-center py-1'>
        <div className='absolute left-0 top-1/2 -translate-y-1/2'>
          {mdUp || isTransparent ? (
            <BackButton noStyle defaultBackLink={defaultBackTo ?? '/'}>
              <span className='flex items-center font-medium text-text-secondary'>
                <HiOutlineChevronLeft className='mr-1' />
                <span>Back</span>
              </span>
            </BackButton>
          ) : (
            <BackButton
              size='circle'
              className='-ml-2 block text-text-primary'
              variant='transparent'
              defaultBackLink={defaultBackTo ?? '/'}
            >
              <HiOutlineChevronLeft />
            </BackButton>
          )}
        </div>
        {!isTransparent && title && <h1>{title}</h1>}
      </div>
    </NavbarExtension>
  )
}
