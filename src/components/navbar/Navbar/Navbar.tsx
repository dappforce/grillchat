import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import { ANN_CHAT_ID } from '@/constants/chat'
import useIsInIframe from '@/hooks/useIsInIframe'
import useLoginOption from '@/hooks/useLoginOption'
import usePrevious from '@/hooks/usePrevious'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getUnreadCountQuery } from '@/services/datahub/posts/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getDatahubConfig } from '@/utils/env/client'
import { getHubPageLink, getUrlQuery } from '@/utils/links'
import { getIdFromSlug } from '@/utils/slug'
import { LocalStorage } from '@/utils/storage'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
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
  const isInitializedAddress = useMyAccount(
    (state) => state.isInitializedAddress
  )
  const router = useRouter()

  const address = useMyMainAddress()
  const prevAddress = usePrevious(address)
  const isLoggedIn = !!address

  const isLoginModalOpen = useLoginModal((state) => state.isOpen)
  const setIsLoginModalOpen = useLoginModal((state) => state.setIsOpen)
  const setLoginModalDefaultOpenState = useLoginModal(
    (state) => state.setDefaultOpenState
  )
  const initialLoginModalOpenState = useLoginModal(
    (state) => state.initialOpenState
  )

  useEffect(() => {
    const auth = getUrlQuery('auth') === 'true'
    if (auth) setIsLoginModalOpen(true)
  }, [setIsLoginModalOpen])

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
      return (
        <ProfileAvatar
          popOverControl={{
            isOpen: openPrivateKeyNotice,
            setIsOpen: setOpenPrivateKeyNotice,
          }}
        />
      )
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
      <Link href={getHubPageLink(router)} aria-label='Back'>
        <Logo className='text-2xl' />
      </Link>
    </div>
  )

  const backButton = (
    <div className='mr-2 flex w-9 items-center justify-center'>
      <BackButton {...backButtonProps} size='circle' variant='transparent'>
        <HiOutlineChevronLeft />
      </BackButton>
    </div>
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
            })
          ) : (
            <div className='flex w-full items-center justify-between'>
              {logoLink}
              <div className='flex items-center gap-2'>
                {notificationBell}
                {authComponent}
              </div>
            </div>
          )}
        </Container>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        closeModal={() => setIsLoginModalOpen(false)}
        initialOpenState={initialLoginModalOpenState}
        beforeLogin={() => (isLoggingInWithKey.current = true)}
        afterLogin={() => (isLoggingInWithKey.current = false)}
      />
      <AuthErrorModal />
    </>
  )
}

const BELL_LAST_READ_STORAGE_NAME = 'announcement-last-read'
const bellLastReadStorage = new LocalStorage(() => BELL_LAST_READ_STORAGE_NAME)
function NotificationBell() {
  const sendEvent = useSendEvent()
  const [lastTimestamp, setLastTimestamp] = useState(() =>
    parseInt(bellLastReadStorage.get() ?? '')
  )

  // enable unread count only from datahub data because we can't get unread count by timestamp from squid/chain
  const { data: unreadCount } = getUnreadCountQuery.useQuery(
    { chatId: ANN_CHAT_ID, lastRead: { timestamp: lastTimestamp } },
    {
      enabled: !!getDatahubConfig() && !!lastTimestamp,
      staleTime: Infinity,
    }
  )

  const { query } = useRouter()
  useEffect(() => {
    if (typeof query.slug !== 'string') return
    if (getIdFromSlug(query.slug) === ANN_CHAT_ID) {
      bellLastReadStorage.set(Date.now().toString())
      setLastTimestamp(Date.now())
    }
  }, [query])

  return (
    <Button
      size='circle'
      variant='transparent'
      className='text-text-muted dark:text-text'
      href={`/x/grill-announcements-${ANN_CHAT_ID}`}
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
