import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import NewCommunityModal from '@/components/community/NewCommunityModal'
import Container from '@/components/Container'
import { ANN_CHAT_ID } from '@/constants/chat'
import useIsInIframe from '@/hooks/useIsInIframe'
import usePrevious from '@/hooks/usePrevious'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getUnreadCountQuery } from '@/services/subsocial/datahub/posts/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getDatahubConfig } from '@/utils/env/client'
import { getHubPageLink } from '@/utils/links'
import { getIdFromSlug } from '@/utils/slug'
import { LocalStorage } from '@/utils/storage'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
import { HiOutlineBell, HiOutlineChevronLeft } from 'react-icons/hi2'
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

  isShowFull?: boolean
  toggleSidebar?: any
}

export default function Navbar({
  customContent,
  backButtonProps,
  isShowFull,
  toggleSidebar,
  ...props
}: NavbarProps) {
  const { enableLoginButton = true } = useConfigContext()
  const isInitialized = useMyAccount((state) => state.isInitialized)
  const [isShowNew, setisShowNew] = useState(false)
  const isTemporaryAccount = useMyAccount((state) => state.isTemporaryAccount)
  const isInitializedAddress = useMyAccount(
    (state) => state.isInitializedAddress
  )
  const router = useRouter()

  const address = useMyMainAddress()
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
        <Image
          src={`/img/logo.jpg`}
          width={300}
          height={300}
          alt='logo'
          className='h-9 w-9 rounded-full object-cover'
        />
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
          'sticky top-0 z-20 flex h-14 items-center  border-b border-border-gray ',
          props.className
        )}
      >
        <Container
          className={cx('flex h-14 w-full justify-between  ', props.className)}
        >
          {customContent ? (
            customContent({
              logoLink,
              authComponent,
              notificationBell,
              backButton,
            })
          ) : (
            <div className='z-20 flex w-full items-center justify-between '>
              <div className='flex items-center gap-2'>
                <div
                  className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800'
                  onClick={toggleSidebar}
                >
                  {isShowFull ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-8 w-8'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-8 w-8'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                      />
                    </svg>
                  )}
                </div>
                {logoLink}
              </div>

              <div className='flex items-center gap-2'>
                <Button onClick={() => setisShowNew(true)}>new space</Button>

                <Link href={`/upload`}>
                  <div className='flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2 text-white dark:bg-white dark:text-black'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-4 w-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                      />
                    </svg>
                    <p>Create</p>
                  </div>
                </Link>
                {notificationBell}
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

      <NewCommunityModal
        isOpen={isShowNew}
        closeModal={() => setisShowNew(false)}
        hubId='1001'
      />
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
