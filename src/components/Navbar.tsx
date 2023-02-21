import { cx } from '@/utils/className'
import localFont from '@next/font/local'
import { ComponentProps } from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'
import Button from './Button'
import Container from './Container'
import LinkText from './LinkText'

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
        <p className={cx(signPainter.className, 'relative top-1 text-2xl')}>
          GrillChat
        </p>
        <div className='flex items-center'>
          <LinkText
            href='https://google.com'
            className='mr-4 flex items-center'
          >
            <HiOutlineLightBulb className='mr-1' /> Suggest Feature
          </LinkText>
          <Button>Login</Button>
        </div>
      </Container>
    </nav>
  )
}
