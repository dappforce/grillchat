import Button, { ButtonProps } from '@/components/Button'
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
import { HiOutlineChevronLeft } from 'react-icons/hi2'

const ProfileAvatar = dynamic(() => import('./ProfileAvatar'), {
  ssr: false,
})
const LoginModal = dynamic(() => import('@/components/modals/LoginModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  customContent?: (elements: {
    logoLink: JSX.Element
    authComponent: JSX.Element
    colorModeToggler: JSX.Element
    backButton: JSX.Element
  }) => JSX.Element
}

export default function Navbar({ customContent, ...props }: NavbarProps) {
  const isInIframe = useIsInIframe()
  const prevUrl = useLocation((state) => state.prevUrl)

  const isInitialized = useMyAccount((state) => state.isInitialized)
  const isInitializedAddress = useMyAccount(
    (state) => state.isInitializedAddress
  )
  const router = useRouter()

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

  const colorModeToggler = (
    <ColorModeToggler className='text-text-muted dark:text-text' />
  )

  const logoLink = (
    <Link href={getHomePageLink(router)} aria-label='Back to home'>
      <Logo className='text-2xl' />
    </Link>
  )

  const hasBackToCurrentSession = !!prevUrl
  const buttonProps: ButtonProps = hasBackToCurrentSession
    ? { onClick: () => router.back() }
    : { href: getHomePageLink(router), nextLinkProps: { replace: isInIframe } }
  const backButton = (
    <div className='mr-2 flex w-9 items-center justify-center'>
      <Button size='circle' {...buttonProps} variant='transparent'>
        <HiOutlineChevronLeft />
      </Button>
    </div>
  )

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
            customContent({
              logoLink,
              authComponent,
              colorModeToggler,
              backButton,
            })
          ) : (
            <div className='flex items-center justify-between'>
              {logoLink}
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
