import FarcasterLogo from '@/assets/graphics/farcaster.svg'
import TwitterLogo from '@/assets/graphics/twitter.svg'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Logo from '@/components/Logo'
import Sidebar from '@/components/layouts/Sidebar'
import CustomLink from '@/components/referral/CustomLink'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getHubPageLink } from '@/utils/links'
import { Dialog, Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ComponentProps, Fragment, ReactNode, useState } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
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
  const router = useRouter()
  const sendEvent = useSendEvent()

  const address = useMyMainAddress()
  const { data: profile } = getProfileQuery.useQuery(address ?? '')
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

  const hamburgerMenu = (
    <Button
      size='circle'
      variant='transparent'
      className='-ml-2 mr-1 md:hidden'
      onClick={() => setOpenSidebar(true)}
    >
      <RxHamburgerMenu className='text-xl text-text-muted' />
    </Button>
  )

  const logoLink = (
    <div className='flex items-center'>
      {hamburgerMenu}
      <CustomLink href={getHubPageLink(router)} aria-label='Back'>
        <Logo className='text-xl' />
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
          {customContent ? (
            customContent({
              logoLink,
              authComponent,
              backButton,
              newPostButton,
              hamburgerMenu,
            })
          ) : (
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
                </div>
                <div className='ml-2.5'>{authComponent}</div>
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

// const LAST_READ_NOTIFICATION_KEY = 'lastReadNotification'
// function NotificationBell() {
// const myAddress = useMyMainAddress()
// const isInitialized = useMyAccount.use.isInitialized()

// const { getDataForAddress } = useExternalStorage(LAST_READ_NOTIFICATION_KEY, {
//   storageKeyType: 'user',
// })

// const lastReadNotif = getDataForAddress(myAddress ?? '')
// const { data: unreadCount } = getNotificationCountQuery.useQuery(
//   {
//     address: myAddress ?? '',
//     afterDate: lastReadNotif || undefined,
//   },
//   { enabled: !!myAddress && !!lastReadNotif && !!isInitialized }
// )
//   const sendEvent = useSendEvent()

//   return (
//     <Button
//       size='circle'
//       variant='transparent'
//       className='relative top-px text-text-muted dark:text-text'
//       nextLinkProps={{ forceHardNavigation: true }}
//       href='/notifications'
//       onClick={() => sendEvent('open_ann_chat', { eventSource: 'notifs_bell' })}
//     >
//       <div className='relative'>
//         <FaRegBell className='text-xl' />
//         {/* {!!unreadCount && unreadCount > 0 && (
//           <div className='absolute right-0.5 top-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-text-red px-1.5 text-xs text-text-on-primary'>
//             {unreadCount}
//           </div>
//         )} */}
//       </div>
//     </Button>
//   )
// }
