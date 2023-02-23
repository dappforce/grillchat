import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'
import Button from '../../Button'
import Container from '../../Container'
import LinkText from '../../LinkText'
import Logo from '../../Logo'
import ProfileAvatar from './ProfileAvatar'

export type NavbarProps = ComponentProps<'div'>

export default function Navbar({ ...props }: NavbarProps) {
  const isLoggedIn = true

  return (
    <nav
      {...props}
      className={cx(
        'sticky top-0 z-10 flex h-14 items-center border-b border-border-gray bg-background-light',
        props.className
      )}
    >
      <Container
        className={cx(
          'flex items-center justify-between py-2',
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
          {isLoggedIn ? (
            <ProfileAvatar address='asdfasdf' />
          ) : (
            <Button>Login</Button>
          )}
        </div>
      </Container>
    </nav>
  )
}
