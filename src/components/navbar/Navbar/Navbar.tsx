import FarcasterLogo from '@/assets/graphics/farcaster.svg'
import TwitterLogo from '@/assets/graphics/twitter.svg'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Sidebar from '@/components/layouts/Sidebar'
import CustomLink from '@/components/referral/CustomLink'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { Dialog, Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { ComponentProps, Fragment, ReactNode, useState } from 'react'
import useLoginInTelegramMiniApps from './telegramLogin/useLoginInTelegramMiniApps'

const ProfileAvatar = dynamic(() => import('./ProfileAvatar'), {
  ssr: false,
  loading: () => <div className='w-20' />,
})
const LoginModal = dynamic(() => import('@/components/auth/LoginModal'), {
  ssr: false,
})
const AuthErrorModal = dynamic(() => import('./AuthErrorModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  withLargerContainer?: boolean
  backButtonProps?: {
    defaultBackLink: string
    forceUseDefaultBackLink?: boolean
  }
  containerClassName?: string
  customContent?: (elements: {
    logoLink: ReactNode
    authComponent: ReactNode
    backButton: ReactNode
    newPostButton: ReactNode
    hamburgerMenu: ReactNode
  }) => JSX.Element
}

export default function Navbar({
  withLargerContainer,
  customContent,
  backButtonProps,
  containerClassName,
  ...props
}: NavbarProps) {
  const setIsLoginModalOpen = useLoginModal.use.setIsOpen()
  const [openSidebar, setOpenSidebar] = useState(false)
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const isTemporaryAccount = useMyAccount((state) => state.isTemporaryAccount)
  useLoginInTelegramMiniApps()

  const sendEvent = useSendEvent()

  const address = useMyMainAddress()
  const isLoggedIn = !!address

  const renderAuthComponent = () => {
    if (!isInitialized) return <div className='w-20' />

    if (isLoggedIn && !isTemporaryAccount) {
      return <ProfileAvatar />
    }

    return (
      <Button
        onClick={() => {
          setIsLoginModalOpen(true)
          sendEvent('login_button_clicked', { eventSource: 'navbar' })
        }}
        className='px-5 text-sm'
      >
        Login
      </Button>
    )
  }
  const authComponent = renderAuthComponent()

  const logoLink = (
    <div className='flex items-center'>
      <CustomLink href='/memes' aria-label='Back'>
        <Logo className='text-base' />
      </CustomLink>
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
        <Container className={cx('flex h-14 w-full', containerClassName)}>
          <div className='flex w-full items-center justify-between'>
            {logoLink}
            <div className='flex items-center'>
              <div className='flex items-center gap-4'>
                <CustomLink href=''>
                  <TwitterLogo />
                </CustomLink>
                <CustomLink href=''>
                  <FarcasterLogo />
                </CustomLink>
                <div>{authComponent}</div>
              </div>
            </div>
          </div>
        </Container>
      </nav>
      <LoginModal />
      <AuthErrorModal />
      <DrawerSidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
    </>
  )
}

function DrawerSidebar({
  openSidebar,
  setOpenSidebar,
}: {
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
}) {
  return (
    <Transition appear show={openSidebar} as={Fragment}>
      <Dialog
        as='div'
        className={cx('relative z-40')}
        onClose={() => setOpenSidebar(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed top-14 z-20 h-[calc(100vh_-_3.5rem)] w-full bg-black/50 opacity-0 backdrop-blur-sm' />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0 left-[-220px]'
          enterTo='opacity-100 left-0'
          leave='ease-in duration-150'
          leaveFrom='opacity-100 left-0'
          leaveTo='opacity-0 left-[-220px]'
        >
          <Dialog.Panel
            as='div'
            className='fixed top-14 z-30 h-[calc(100vh_-_3.5rem)] w-[220px] bg-background pl-4'
          >
            <Sidebar />
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
