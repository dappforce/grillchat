import LinkText from '@/components/LinkText'
import { useLocation } from '@/stores/location'
import { cx } from '@/utils/class-names'
import { Source_Sans_Pro } from 'next/font/google'
import { ComponentProps } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import useBreakpointThreshold from '../../hooks/useBreakpointThreshold'
import Button from '../Button'
import Navbar, { NavbarProps } from '../navbar/Navbar'
import NavbarExtension from '../navbar/NavbarExtension'

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

export type DefaultLayoutProps = ComponentProps<'div'> & {
  navbarProps?: NavbarProps
  withBackButton?: LayoutNavbarExtensionProps
}

export default function DefaultLayout({
  children,
  navbarProps,
  withBackButton,
  ...props
}: DefaultLayoutProps) {
  return (
    <div
      className={cx(
        'flex h-screen flex-col bg-background text-text',
        sourceSansPro.className
      )}
      style={{ height: '100svh' }}
      {...props}
    >
      <Navbar {...navbarProps} />
      {withBackButton && <LayoutNavbarExtension {...withBackButton} />}
      {children}
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
  const { prevUrl } = useLocation()
  const mdUp = useBreakpointThreshold('md')

  return (
    <NavbarExtension
      className={cx(
        'fixed w-full transition',
        isTransparent && 'border-none bg-transparent'
      )}
    >
      <div className='relative flex h-8 items-center justify-center py-1'>
        <div className='absolute top-1/2 left-0 -translate-y-1/2'>
          {mdUp || isTransparent ? (
            <LinkText
              href={prevUrl || defaultBackTo || '/'}
              variant='secondary'
              className='flex items-center'
            >
              <HiOutlineChevronLeft className='mr-1' />
              <span>Back</span>
            </LinkText>
          ) : (
            <Button
              href='/'
              size='noPadding'
              className='block text-text-primary'
              variant='transparent'
            >
              <HiOutlineChevronLeft />
            </Button>
          )}
        </div>
        {!isTransparent && title && <h1>{title}</h1>}
      </div>
    </NavbarExtension>
  )
}
