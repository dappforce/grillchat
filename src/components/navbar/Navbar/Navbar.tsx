import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Sidebar from '@/components/layouts/Sidebar'
import CustomLink from '@/components/referral/CustomLink'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLoginOption from '@/hooks/useLoginOption'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getProfileQuery } from '@/services/api/query'
import { getNotificationCountQuery } from '@/services/subsocial/notifications/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getHubPageLink } from '@/utils/links'
import { useExternalStorage } from '@/utils/polkaverse-storage'
import { Dialog, Transition } from '@headlessui/react'
import { Wallet, getWallets } from '@talismn/connect-wallets'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ComponentProps, Fragment, ReactNode, useEffect, useState } from 'react'
import { HiOutlineBell, HiOutlineChevronLeft } from 'react-icons/hi2'
import { RxHamburgerMenu } from 'react-icons/rx'
import AuthErrorModal from './AuthErrorModal'

const ProfileAvatar = dynamic(() => import('./ProfileAvatar'), {
  ssr: false,
  loading: () => <div className='w-20' />,
})
const LoginModal = dynamic(() => import('@/components/auth/LoginModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  withSidebar?: boolean
  backButtonProps?: {
    defaultBackLink: string
    forceUseDefaultBackLink?: boolean
  }
  containerClassName?: string
  customContent?: (elements: {
    logoLink: ReactNode
    authComponent: ReactNode
    notificationBell: ReactNode
    backButton: ReactNode
    newPostButton: ReactNode
  }) => JSX.Element
}

export default function Navbar({
  withSidebar,
  customContent,
  backButtonProps,
  containerClassName,
  ...props
}: NavbarProps) {
  const [openSidebar, setOpenSidebar] = useState(false)
  const { enableLoginButton = true } = useConfigContext()
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const isTemporaryAccount = useMyAccount((state) => state.isTemporaryAccount)
  const router = useRouter()

  const address = useMyMainAddress()
  const { data: profile } = getProfileQuery.useQuery(address ?? '')
  const isLoggedIn = !!address

  const setIsLoginModalOpen = useLoginModal((state) => state.setIsOpen)
  const setLoginModalDefaultOpenState = useLoginModal(
    (state) => state.setDefaultOpenState
  )

  const { loginOption } = useLoginOption()
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const { defaultWallet } = useConfigContext()
  useEffect(() => {
    if (defaultWallet) {
      const supportedWallets: Wallet[] = getWallets()
      const wallet = supportedWallets.find(
        (wallet) =>
          wallet.title.toLowerCase() === defaultWallet.walletName.toLowerCase()
      )
      if (wallet) {
        setPreferredWallet(wallet)
        setLoginModalDefaultOpenState('polkadot-connect-account')
      }
    }
  }, [defaultWallet, setPreferredWallet, setLoginModalDefaultOpenState])
  const login = () => {
    if (loginOption === 'polkadot') {
      setIsLoginModalOpen(true, 'polkadot-connect')
      return
    }
    setIsLoginModalOpen(true)
  }

  const renderAuthComponent = () => {
    if (!isInitialized) return <div className='w-20' />

    if (isLoggedIn && !isTemporaryAccount) {
      return <ProfileAvatar />
    }

    return enableLoginButton ? (
      <Button onClick={login} className='px-5 text-sm'>
        Login
      </Button>
    ) : (
      <></>
    )
  }
  const authComponent = renderAuthComponent()

  const logoLink = (
    <div className='flex items-center'>
      <Button
        size='circle'
        variant='transparent'
        className='-ml-2 mr-1 lg:hidden'
        onClick={() => setOpenSidebar(true)}
      >
        <RxHamburgerMenu className='text-xl text-text-muted' />
      </Button>
      <CustomLink href={getHubPageLink(router)} aria-label='Back'>
        <Logo className='text-2xl' />
      </CustomLink>
    </div>
  )

  const backButton = (
    <div className='mr-2 flex w-9 items-center justify-center'>
      <BackButton {...backButtonProps} size='circle' variant='transparent'>
        <HiOutlineChevronLeft />
      </BackButton>
    </div>
  )

  const newPostButton = profile?.profileSpace && (
    <Button
      roundings='lg'
      variant='mutedOutline'
      className='mr-2 border-[#D9D9D9] text-sm font-medium text-text'
      size='xs'
      nextLinkProps={{ forceHardNavigation: true }}
      href={`/${profile.profileSpace.id}/posts/new`}
    >
      New post
    </Button>
  )

  const isInIframe = useIsInIframe()
  const notificationBell = !isInIframe && <NotificationBell />

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
          className={cx(
            'flex h-14 w-full',
            withSidebar && 'container-page',
            containerClassName
          )}
        >
          {customContent ? (
            customContent({
              logoLink,
              authComponent,
              notificationBell,
              backButton,
              newPostButton,
            })
          ) : (
            <div className='flex w-full items-center justify-between'>
              {logoLink}
              <div className='flex items-center gap-1'>
                {newPostButton}
                {notificationBell}
                {authComponent}
              </div>
            </div>
          )}
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

const LAST_READ_NOTIFICATION_KEY = 'lastReadNotification'
function NotificationBell() {
  const myAddress = useMyMainAddress()
  const { data: lastReadNotif } = useExternalStorage(
    LAST_READ_NOTIFICATION_KEY,
    { storageKeyType: 'user' }
  )
  const { data: unreadCount } = getNotificationCountQuery.useQuery({
    address: myAddress ?? '',
    afterDate: lastReadNotif,
  })
  const sendEvent = useSendEvent()

  return (
    <Button
      size='circle'
      variant='transparent'
      className='relative top-px text-text-muted dark:text-text'
      nextLinkProps={{ forceHardNavigation: true }}
      href='/notifications'
      onClick={() => sendEvent('open_ann_chat', { eventSource: 'notifs_bell' })}
    >
      <div className='relative'>
        <HiOutlineBell className='text-xl' />
        {!!unreadCount && unreadCount > 0 && (
          <div className='absolute right-0.5 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-text-red px-1.5 text-xs text-text-on-primary'>
            {unreadCount}
          </div>
        )}
      </div>
    </Button>
  )
}
