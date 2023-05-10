import BulbIcon from '@/assets/icons/bulb.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import InfoIcon from '@/assets/icons/info.svg'
import KeyIcon from '@/assets/icons/key.svg'
import ShareIcon from '@/assets/icons/share.svg'
import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import { CopyText, CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import Logo from '@/components/Logo'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import useRandomColor from '@/hooks/useRandomColor'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey, truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { generateRandomName } from '@/utils/random-name'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import urlJoin from 'url-join'

type NotificationControl = {
  showNotif: boolean
  setNotifDone: () => void
}

export type ProfileModalProps = ModalFunctionalityProps & {
  address: string
  notification?: NotificationControl
}

type ModalState =
  | 'account'
  | 'private-key'
  | 'logout'
  | 'share-session'
  | 'about'
const modalTitles: {
  [key in ModalState]: {
    title: React.ReactNode
    desc?: React.ReactNode
    withBackButton?: boolean
  }
} = {
  account: { title: <span className='font-medium'>My Account</span> },
  logout: {
    title: '🤔 Did you back up your Grill secret key?',
    withBackButton: true,
  },
  'private-key': {
    title: '🔑 Grill secret key',
    withBackButton: true,
  },
  'share-session': {
    title: '💻 Share session',
    desc: 'Use this link or scan the QR code to quickly log in to this account on another device.',
    withBackButton: true,
  },
  about: {
    title: 'About app',
    desc: null,
    withBackButton: true,
  },
}

type ContentProps = {
  address: string
  setCurrentState: React.Dispatch<React.SetStateAction<ModalState>>
  notification?: NotificationControl
}
const modalContents: {
  [key in ModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
}

export default function ProfileModal({
  address,
  notification,
  ...props
}: ProfileModalProps) {
  const [currentState, setCurrentState] = useState<ModalState>('account')

  useEffect(() => {
    if (props.isOpen) setCurrentState('account')
  }, [props.isOpen])

  const onBackClick = () => setCurrentState('account')
  const { title, desc, withBackButton } = modalTitles[currentState] || {}
  const Content = modalContents[currentState]

  const shouldRemoveDefaultPadding = currentState === 'account'
  const withFooter = currentState === 'account'

  return (
    <Modal
      {...props}
      title={title}
      description={desc}
      contentClassName={cx(shouldRemoveDefaultPadding && 'px-0 pb-0')}
      titleClassName={cx(shouldRemoveDefaultPadding && 'px-6')}
      withFooter={withFooter}
      withCloseButton
      onBackClick={withBackButton ? onBackClick : undefined}
    >
      <Content
        address={address}
        setCurrentState={setCurrentState}
        notification={notification}
      />
    </Modal>
  )
}

type ButtonData = {
  text: string
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  href?: string
  notification?: NotificationControl
}

function AccountContent({
  address,
  setCurrentState,
  notification,
}: ContentProps) {
  const senderColor = useRandomColor(address)
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
  const onAboutClick = () => {
    sendEvent('click about_app_button')
    setCurrentState('about')
  }

  const buttons: ButtonData[] = [
    {
      text: 'Show Grill secret key',
      icon: KeyIcon,
      onClick: onShowPrivateKeyClick,
      notification,
    },
    { text: 'Share session', icon: ShareIcon, onClick: onShareSessionClick },
    {
      text: 'Suggest feature',
      icon: BulbIcon,
      href: SUGGEST_FEATURE_LINK,
    },
    {
      text: 'About app',
      icon: InfoIcon,
      onClick: onAboutClick,
    },
    { text: 'Log out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  return (
    <div className='mt-2 flex flex-col'>
      <div className='flex items-center gap-4 border-b border-background-lightest px-6 pb-6'>
        <AddressAvatar address={address} className='h-20 w-20' />
        <div className='flex flex-col'>
          <span className='text-lg' style={{ color: senderColor }}>
            {generateRandomName(address)}
          </span>
          <CopyTextInline
            text={truncateAddress(address)}
            tooltip='Copy my Grill public address'
            textToCopy={address}
          />
        </div>
      </div>
      <div className='flex w-full flex-col gap-6 py-6 px-3'>
        {buttons.map(({ icon: Icon, onClick, text, href, notification }) => (
          <Button
            key={text}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            variant='transparent'
            size='noPadding'
            interactive='none'
            className={cx(
              'relative flex items-center px-6 [&>*]:z-10',
              'after:absolute after:top-1/2 after:left-0 after:h-full after:w-full after:-translate-y-1/2 after:rounded-lg after:bg-transparent after:py-6 after:transition-colors',
              'outline-none focus:after:bg-background-lighter hover:after:bg-background-lighter'
            )}
            onClick={() => {
              notification?.setNotifDone()
              onClick?.()
            }}
          >
            <Icon className='mr-6 text-xl text-text-muted' />
            <span>{text}</span>
            {notification?.showNotif && (
              <span className='relative ml-2 h-2 w-2'>
                <span className='absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-background-warning opacity-75'></span>
                <span className='relative block h-full w-full rounded-full bg-background-warning' />
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

function PrivateKeyContent() {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)
  const secretKey = decodeSecretKey(encodedSecretKey ?? '')

  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_private_key_button')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <p className='mb-2 text-text-muted'>
        A Grill secret key is like a long password. We recommend keeping it in a
        safe place, so you can recover your account.
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
        No, show me my Grill secret key
      </Button>
      <Button size='lg' onClick={onLogoutClick} variant='primaryOutline'>
        Yes, log out
      </Button>
    </div>
  )
}

function ShareSessionContent() {
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)
  const sendEvent = useSendEvent()
  const onCopyClick = () => {
    sendEvent('click copy_share_session_link')
  }

  const shareSessionLink = urlJoin(
    getCurrentUrlOrigin(),
    `/account?${ACCOUNT_SECRET_KEY_URL_PARAMS}=${encodedSecretKey}`
  )

  return (
    <div className='mt-2 flex flex-col gap-4'>
      <div className='mx-auto mb-2 h-40 w-40 rounded-2xl bg-white p-4'>
        <QRCode
          value={shareSessionLink}
          size={256}
          className='h-full w-full'
          viewBox='0 0 256 256'
        />
      </div>
      <CopyText text={shareSessionLink} onCopyClick={onCopyClick} />
    </div>
  )
}

function AboutContent() {
  return (
    <div className='mt-2 flex flex-col gap-4'>
      <div className='flex justify-center'>
        <Logo className='text-5xl' />
      </div>
      <p className='text-text-muted'>
        Engage in discussions anonymously without fear of social persecution.
        Grill.chat runs on the{' '}
        <LinkText
          openInNewTab
          href='https://subsocial.network/xsocial'
          variant='primary'
        >
          xSocial
        </LinkText>{' '}
        blockchain and backs up its content to{' '}
        <LinkText openInNewTab href='https://ipfs.tech/' variant='primary'>
          IPFS
        </LinkText>
        .
      </p>
      <div className='rounded-2xl border border-background-warning py-2 px-4 text-text-warning'>
        xSocial is an experimental environment for innovative web3 social
        features before they are deployed on{' '}
        <LinkText
          openInNewTab
          href='https://subsocial.network'
          variant='primary'
        >
          Subsocial
        </LinkText>
      </div>
    </div>
  )
}
