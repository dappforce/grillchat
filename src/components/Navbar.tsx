import { cx } from '@/utils/className'
import localFont from '@next/font/local'
import { ComponentProps } from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'
import Button from './Button'
import Container from './Container'
import LinkText from './LinkText'
import Logo from './Logo'

export type NavbarProps = ComponentProps<'div'>

const signPainter = localFont({ src: '../assets/fonts/SignPainter.ttf' })

export default function Navbar({ ...props }: NavbarProps) {
  return (
    <nav {...props} className={cx('bg-background-light', props.className)}>
      <Container
        className={cx(
          'flex items-center justify-between py-3',
          props.className
        )}
      >
        <Logo className='text-3xl' />
        <div className='flex items-center'>
          <LinkText
            href='https://google.com'
            className='mr-6 flex items-center'
          >
            <HiOutlineLightBulb className='mr-1' /> Suggest Feature
          </LinkText>
          <Button>Login</Button>
        </div>
      </Container>
    </nav>
  )
}
