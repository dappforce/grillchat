import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ComponentProps, useRef, useState } from 'react'
import { HiOutlineLightBulb } from 'react-icons/hi'
import Button from '../../Button'
import Container from '../../Container'
import LinkText from '../../LinkText'
import Logo from '../../Logo'
import ProfileAvatar from './ProfileAvatar'

const LoginModal = dynamic(() => import('@/components/LoginModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  customContent?: (authComponent: JSX.Element) => JSX.Element
}

export default function Navbar({ customContent, ...props }: NavbarProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const isInitializedAddress = useMyAccount(
    (state) => state.isInitializedAddress
  )
  const address = useMyAccount((state) => state.address)
  const isLoggedIn = !!address

  const [openLoginModal, setOpenLoginModal] = useState(false)
  const isLoggingInWithKey = useRef(false)

  const login = () => {
    setOpenLoginModal(true)
  }

  const renderAuthComponent = () => {
    if (!isInitialized) return <div className='w-9' />
    return isLoggedIn ? (
      <ProfileAvatar
        displayPopOver={!isLoggingInWithKey.current && !isInitializedAddress}
        address={address}
      />
    ) : (
      <Button onClick={login}>Login</Button>
    )
  }
  const authComponent = renderAuthComponent()

  return (
    <>
      <nav
        {...props}
        className={cx(
          'sticky top-0 z-20 flex h-14 items-center border-b border-border-gray bg-background-light',
          props.className
        )}
      >
        <Container
          className={cx('grid h-14 items-center py-2', props.className)}
        >
          {customContent ? (
            customContent(authComponent)
          ) : (
            <div className='flex items-center justify-between'>
              <Link href='/'>
                <Logo className='text-2xl' />
              </Link>
              <div className='flex items-center'>
                <LinkText
                  href='https://google.com'
                  className='mr-6 flex items-center'
                >
                  <HiOutlineLightBulb className='mr-1' /> Suggest Feature
                </LinkText>
                {authComponent}
              </div>
            </div>
          )}
        </Container>
      </nav>
      <LoginModal
        isOpen={openLoginModal}
        closeModal={() => setOpenLoginModal(false)}
        beforeLogin={() => (isLoggingInWithKey.current = true)}
        afterLogin={() => (isLoggingInWithKey.current = false)}
      />
    </>
  )
}
