import GrillIcon from '@/assets/logo/logo.svg'
import Button from '@/components/Button'
import ProfilePreview from '@/components/ProfilePreview'
import LoginModal from '@/components/auth/LoginModal'
import ProfileModal from '@/components/auth/ProfileModal'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { IconType } from 'react-icons'
import { BiChat, BiCoinStack, BiNews } from 'react-icons/bi'

const links: {
  text: string
  href: string
  icon: IconType
  pathname?: string
}[] = [
  { text: 'Feed', href: '/', icon: BiNews },
  { text: 'Chats', href: '/chats', icon: BiChat },
  { text: 'Content Staking', href: '/content-staking', icon: BiCoinStack },
]

export default function Sidebar({ ...props }: ComponentProps<'aside'>) {
  const myAddress = useMyMainAddress()
  const isInitialized = useMyAccount.use.isInitialized()
  const isTemporaryAccount = useMyAccount.use.isTemporaryAccount()
  const { pathname } = useRouter()

  const setLoginModalOpen = useLoginModal.use.setIsOpen()
  const openProfileModal = useProfileModal.use.openModal()

  return (
    <>
      <nav
        {...props}
        className={cx(
          'sticky top-0 flex h-screen flex-col px-4 py-4',
          props.className
        )}
        style={{ height: '100dvh' }}
      >
        <Link href='/'>
          <GrillIcon className='text-2xl' />
        </Link>
        <ul className='mt-6 flex flex-col gap-4'>
          {links.map((link) => (
            <li
              key={link.text}
              className='relative before:absolute before:-left-4 before:-top-2 before:h-[calc(100%_+_1rem)] before:w-[calc(100%_+_2rem)] before:rounded-full before:bg-background-light before:opacity-0 before:transition-opacity hover:before:opacity-50'
            >
              <Link
                href={link.href}
                className={cx(
                  'relative flex items-center gap-4 text-lg font-medium text-text-muted',
                  pathname === (link.pathname ?? link.href) && 'text-text'
                )}
              >
                <link.icon className='text-xl' />
                <span>{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className='mt-auto'>
          {isInitialized &&
            (myAddress && !isTemporaryAccount ? (
              <div
                className={cx(
                  'relative before:absolute before:-left-4 before:-top-2 before:h-[calc(100%_+_1rem)] before:w-[calc(100%_+_2rem)] before:rounded-full before:bg-background-light before:opacity-0 before:transition-opacity hover:before:opacity-50'
                )}
              >
                <ProfilePreview
                  onClick={() => openProfileModal()}
                  address={myAddress}
                  className='relative cursor-pointer gap-2'
                  tooltipPlacement='top'
                  nameContainerClassName='gap-0.5'
                  avatarClassName={cx('h-9 w-9')}
                  nameClassName='text-base font-medium'
                  addressClassName='text-sm text-text-muted'
                />
              </div>
            ) : (
              <Button
                size='lg'
                className='w-full'
                onClick={() => setLoginModalOpen(true)}
              >
                Login
              </Button>
            ))}
        </div>
      </nav>
      <ProfileModal />
      <LoginModalWithContextData />
    </>
  )
}

function LoginModalWithContextData() {
  const { initialOpenState, isOpen, setIsOpen } = useLoginModal()
  return (
    <LoginModal
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
      initialOpenState={initialOpenState}
    />
  )
}
