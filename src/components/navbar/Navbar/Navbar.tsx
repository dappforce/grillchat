import Button from '@/components/Button'
import ColorModeToggler from '@/components/ColorModeToggler'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import useIsInIframe from '@/hooks/useIsInIframe'
import usePrevious from '@/hooks/usePrevious'
import { useLocation } from '@/stores/location'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getHomePageLink } from '@/utils/links'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, useEffect, useRef, useState } from 'react'

const ProfileAvatar = dynamic(() => import('./ProfileAvatar'), {
  ssr: false,
})
const LoginModal = dynamic(() => import('@/components/LoginModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  customContent?: (
    authComponent: JSX.Element,
    colorModeToggler: JSX.Element
  ) => JSX.Element
}

export default function Navbar({ customContent, ...props }: NavbarProps) {
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const isInitializedAddress = useMyAccount(
    (state) => state.isInitializedAddress
  )
  const router = useRouter()
  const prevUrl = useLocation((state) => state.prevUrl)

  const isInIframe = useIsInIframe()
  const address = useMyAccount((state) => state.address)
  const prevAddress = usePrevious(address)
  const isLoggedIn = !!address

  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openPrivateKeyNotice, setOpenPrivateKeyNotice] = useState(false)
  const isLoggingInWithKey = useRef(false)
  const timeoutRef = useRef<any>()

  useEffect(() => {
    const isChangedAddressFromGuest = prevAddress === null && address
    if (
      isInitializedAddress ||
      isLoggingInWithKey.current ||
      !address ||
      !isChangedAddressFromGuest
    )
      return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setOpenPrivateKeyNotice(true)
    }, 10_000)
  }, [address, isInitializedAddress, prevAddress])

  const login = () => {
    setOpenLoginModal(true)
  }

  const renderAuthComponent = () => {
    if (!isInitialized) return <div className='w-9' />
    return isLoggedIn ? (
      <ProfileAvatar
        popOverControl={{
          isOpen: openPrivateKeyNotice,
          setIsOpen: setOpenPrivateKeyNotice,
        }}
        address={address}
      />
    ) : (
      <Button onClick={login}>Login</Button>
    )
  }
  const authComponent = renderAuthComponent()
  const colorModeToggler = <ColorModeToggler />

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
            customContent(authComponent, colorModeToggler)
          ) : (
            <div className='flex items-center justify-between'>
              <Link
                href={(isInIframe && prevUrl) || getHomePageLink(router.asPath)}
                aria-label='Back to home'
              >
                <Logo className='text-2xl' />
              </Link>
              <div className='flex items-center gap-4'>
                {colorModeToggler}
                {authComponent}
              </div>
            </div>
          )}
        </Container>
      </nav>
      <LoginModal
        isOpen={openLoginModal}
        openModal={() => setOpenLoginModal(true)}
        closeModal={() => setOpenLoginModal(false)}
        beforeLogin={() => (isLoggingInWithKey.current = true)}
        afterLogin={() => (isLoggingInWithKey.current = false)}
      />
    </>
  )
}
