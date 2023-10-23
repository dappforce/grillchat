import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import { ANN_CHAT_ID } from '@/constants/chat'
import useIsInIframe from '@/hooks/useIsInIframe'
import usePrevious from '@/hooks/usePrevious'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getBlockedResourcesQuery } from '@/services/api/moderation/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getHubPageLink } from '@/utils/links'
import { getIdFromSlug } from '@/utils/slug'
import { LocalStorage } from '@/utils/storage'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ComponentProps,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
        isOpen={openLoginModal}
        closeModal={() => setOpenLoginModal(false)}
        beforeLogin={() => (isLoggingInWithKey.current = true)}
        afterLogin={() => (isLoggingInWithKey.current = false)}
      />
    </>
  )
}

const BELL_LAST_READ_STORAGE_NAME = 'announcement-last-read'
const bellLastReadStorage = new LocalStorage(() => BELL_LAST_READ_STORAGE_NAME)
function NotificationBell() {
  const sendEvent = useSendEvent()
  const { data: messageIds } = useCommentIdsByPostId(ANN_CHAT_ID)
  const { data: blockedEntities } = getBlockedResourcesQuery.useQuery({
    postId: ANN_CHAT_ID,
  })
  const blockedIds = blockedEntities?.blockedResources.postId

  const filteredMessageIds = useMemo(() => {
    if (!messageIds || !blockedIds) return null
    return messageIds.filter((id) => !blockedIds.includes(id))
  }, [messageIds, blockedIds])

  const [unreadCount, setUnreadCount] = useState(0)

  const { query } = useRouter()
  useEffect(() => {
    if (typeof query.slug !== 'string' || !filteredMessageIds) return
    if (getIdFromSlug(query.slug) === ANN_CHAT_ID) {
      const lastMessageId = filteredMessageIds[filteredMessageIds.length - 1]
      bellLastReadStorage.set(lastMessageId)
      setUnreadCount(0)
    }
  }, [query, filteredMessageIds])

  useEffect(() => {
    const lastRead = bellLastReadStorage.get()
    if (!filteredMessageIds) return

    const lastReadIndex = filteredMessageIds?.findIndex((id) => id === lastRead)

    let unreadCount
    if (lastReadIndex === -1) unreadCount = filteredMessageIds?.length
    else unreadCount = filteredMessageIds?.length - lastReadIndex - 1

    setUnreadCount(unreadCount)
  }, [filteredMessageIds])

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
        {unreadCount > 0 && (
          <div className='absolute right-0.5 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-text-red px-1.5 text-xs text-text-on-primary'>
            {unreadCount}
          </div>
        )}
      </div>
    </Button>
  )
}
