import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { cx } from '@/utils/class-names'
import { currentNetwork } from '@/utils/network'
import { ComponentProps } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import BackButton from '../BackButton'
import Container from '../Container'
import Navbar, { NavbarProps } from '../navbar/Navbar'
import NavbarExtension from '../navbar/NavbarExtension'
import Sidebar from './Sidebar'

export type DefaultLayoutProps = ComponentProps<'div'> & {
  navbarProps?: NavbarProps
  withBackButton?: LayoutNavbarExtensionProps
  withFixedHeight?: boolean
  withSidebar?: boolean
}

export default function DefaultLayout({
  children,
  navbarProps,
  withBackButton,
  withFixedHeight,
  withSidebar,
  ...props
}: DefaultLayoutProps) {
  if (currentNetwork === 'xsocial') {
    withSidebar = false
  }

  return (
    <div
      className={cx(
        'flex flex-col bg-background text-text',
        withFixedHeight && 'h-screen'
      )}
      style={withFixedHeight ? { height: '100dvh' } : { minHeight: '100svh' }}
      {...props}
    >
      <Navbar {...navbarProps} withSidebar={withSidebar} />
      {withBackButton && <LayoutNavbarExtension {...withBackButton} />}
      {withSidebar ? (
        <Container className='flex flex-1 px-0 md:pl-3'>
          <div className='sticky top-14 hidden w-[225px] border-r border-border-gray md:block'>
            <Sidebar />
          </div>
          <div className='flex flex-1 flex-col'>{children}</div>
        </Container>
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
