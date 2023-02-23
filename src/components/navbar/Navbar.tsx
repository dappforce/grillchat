import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import Container from '../Container'
import LinkText from '../LinkText'
import Logo from '../Logo'
import PopOver from '../PopOver'

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
            <PopOver
              withCloseButton
              trigger={<AddressAvatar address='asdfasdf' />}
            >
              <p>Click on your avatar and save your private key</p>
            </PopOver>
          ) : (
            <Button>Login</Button>
          )}
        </div>
      </Container>
    </nav>
  )
}
