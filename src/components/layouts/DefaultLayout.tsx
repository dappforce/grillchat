import { cx } from '@/utils/class-names'
import { Source_Sans_Pro } from 'next/font/google'
import { ComponentProps } from 'react'
import Navbar, { NavbarProps } from '../navbar/Navbar'

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

export type DefaultLayoutProps = ComponentProps<'div'> & {
  navbarProps?: NavbarProps
}

export default function DefaultLayout({
  children,
  navbarProps,
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
      {children}
    </div>
  )
}
