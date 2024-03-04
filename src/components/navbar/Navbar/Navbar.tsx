import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
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
import { Wallet, getWallets } from '@talismn/connect-wallets'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ComponentProps, ReactNode, useEffect } from 'react'
import { HiOutlineBell, HiOutlineChevronLeft } from 'react-icons/hi2'
import AuthErrorModal from './AuthErrorModal'

const ProfileAvatar = dynamic(() => import('./ProfileAvatar'), {
  ssr: false,
  loading: () => <div className='w-20' />,
})
const LoginModal = dynamic(() => import('@/components/auth/LoginModal'), {
  ssr: false,
})

export type NavbarProps = ComponentProps<'div'> & {
  backButtonProps?: {
    defaultBackLink: string
    forceUseDefaultBackLink?: boolean
  }
  customContent?: (elements: {
    logoLink: ReactNode
    authComponent: ReactNode
    notificationBell: ReactNode
    backButton: ReactNode
    newPostButton: ReactNode
  }) => JSX.Element
}

export default function Navbar({
  customContent,
  backButtonProps,
  ...props
}: NavbarProps) {
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
      return <ProfileAvatar className='ml-1.5' />
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
        <Container className={cx('flex h-14 w-full', props.className)}>
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
              <div className='flex items-center gap-2'>
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
    </>
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
