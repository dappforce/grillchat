import BulbIcon from '@/assets/icons/bulb.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import KeyIcon from '@/assets/icons/key.svg'
import ShareIcon from '@/assets/icons/share.svg'
import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import { CopyText, CopyTextInline } from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getBaseUrl } from '@/utils/env/client'
import React, { useEffect, useState } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import QRCode from 'react-qr-code'
import urlJoin from 'url-join'

type ProfileModalProps = ModalFunctionalityProps & {
  address: string
}

type ModalState = 'account' | 'private-key' | 'logout' | 'share-session'
const modalTitles: {
  [key in ModalState]: (onBackClick?: () => void) => React.ReactNode
} = {
  account: () => <span className='font-medium'>My Account</span>,
  logout: () => '🤔 Did you back up your private key?',
  'private-key': (onBackClick) => (
    <div className='flex items-center'>
      <Button
        size='circle'
        variant='transparent'
        className='mr-1 text-lg'
        onClick={onBackClick}
      >
        <HiOutlineChevronLeft />
      </Button>
      <span>🔑 Private key</span>
    </div>
  ),
  'share-session': (onBackClick) => (
    <div className='flex items-center'>
      <Button
        size='circle'
        variant='transparent'
        className='mr-1 text-lg'
        onClick={onBackClick}
      >
        <HiOutlineChevronLeft />
      </Button>
      <span>💻 Share session</span>
    </div>
  ),
}

type ContentProps = {
  address: string
  setCurrentState: React.Dispatch<React.SetStateAction<ModalState>>
}
const modalContents: {
  [key in ModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
}

export default function ProfileModal({ address, ...props }: ProfileModalProps) {
  const [currentState, setCurrentState] = useState<ModalState>('account')

  useEffect(() => {
    if (props.isOpen) setCurrentState('account')
  }, [props.isOpen])

  const onBackClick = () => setCurrentState('account')
  const title = modalTitles[currentState]?.(onBackClick)
  const Content = modalContents[currentState]

  const shouldRemoveDefaultPadding = currentState === 'account'
  const withFooter = currentState === 'account'

  return (
    <Modal
      {...props}
      title={title}
      contentClassName={cx(shouldRemoveDefaultPadding && 'px-0 pb-0')}
      titleClassName={cx(shouldRemoveDefaultPadding && 'px-6')}
      withFooter={withFooter}
      withCloseButton
    >
      <Content address={address} setCurrentState={setCurrentState} />
    </Modal>
  )
}

type ButtonData = {
  text: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
}
function AccountContent({ address, setCurrentState }: ContentProps) {
  const sendEvent = useSendEvent()
  const onShowPrivateKeyClick = () => {
    sendEvent('click show_private_key_button')
    setCurrentState('private-key')
  }
  const onShareSessionClick = () => {
    sendEvent('click share_session_button')
    setCurrentState('share-session')
  }
  const onLogoutClick = () => {
    sendEvent('click log_out_button')
    setCurrentState('logout')
  }

  const buttons: ButtonData[] = [
    { text: 'Show private key', icon: KeyIcon, onClick: onShowPrivateKeyClick },
    { text: 'Share session', icon: ShareIcon, onClick: onShareSessionClick },
    { text: 'Suggest feature', icon: BulbIcon, href: '/' },
    { text: 'Log out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  return (
    <div className='mt-2 flex flex-col'>
      <div className='flex items-center gap-4 border-b border-background-lightest px-6 pb-6'>
        <AddressAvatar address={address} className='h-20 w-20' />
        <CopyTextInline text={truncateAddress(address)} textToCopy={address} />
      </div>
      <div className='flex w-full flex-col gap-6 py-6 px-3'>
        {buttons.map(({ icon: Icon, onClick, text, href }) => (
          <Button
            key={text}
            href={href}
            variant='transparent'
            size='noPadding'
            interactive='none'
            className={cx(
              'relative flex items-center gap-6 px-6 [&>*]:z-10',
              'after:absolute after:top-1/2 after:left-0 after:h-full after:w-full after:-translate-y-1/2 after:rounded-lg after:bg-transparent after:py-6 after:transition-colors',
              'outline-none focus:after:bg-background-lighter hover:after:bg-background-lighter'
            )}
            onClick={onClick}
          >
            <Icon className='text-xl' />
            <span>{text}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

function PrivateKeyContent() {
  const secretKey = useMyAccount((state) => state.secretKey)
  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_private_key_button')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='mb-2 text-text-muted'>
        A private key is like a long password. We recommend keeping it in a safe
        place, so you can recover your account.
      </p>
      <CopyText onCopyClick={onCopyClick} isCodeText text={secretKey || ''} />
    </div>
  )
}

function LogoutContent({ setCurrentState }: ContentProps) {
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const onShowPrivateKeyClick = () => {
    sendEvent('click no_show_me_my_private_key_button')
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('click yes_log_out_button')
    logout()
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onShowPrivateKeyClick}>
        No, show me my private key
      </Button>
      <Button size='lg' onClick={onLogoutClick} variant='primaryOutline'>
        Yes, log out
      </Button>
    </div>
  )
}

function ShareSessionContent() {
  const secretKey = useMyAccount((state) => state.secretKey)
  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_share_session_link')
  }

  const shareSessionLink = urlJoin(getBaseUrl(), `/account?k=${secretKey}`)

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <div className='mx-auto mb-2 h-40 w-40 rounded-2xl bg-white p-4'>
        <QRCode
          value={shareSessionLink}
          size={256}
          className='h-full w-full'
          viewBox='0 0 256 256'
        />
      </div>
      <CopyText text={shareSessionLink} onCopyClick={onCopyClick} />
      <p className='text-text-muted'>
        Use this link or scan the QR code to quickly log in to this account on
        another device.
      </p>
    </div>
  )
}
