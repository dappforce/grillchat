import BulbIcon from '@/assets/icons/bulb.svg'
import EthIcon from '@/assets/icons/eth.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import ExternalLinkIcon from '@/assets/icons/external-link.svg'
import InfoIcon from '@/assets/icons/info.svg'
import KeyIcon from '@/assets/icons/key.svg'
import ShareIcon from '@/assets/icons/share.svg'
import AboutGrillDesc from '@/components/AboutGrillDesc'
import Button from '@/components/Button'
import { CommonEVMLoginErrorContent, CommonEvmAddressLinked } from '@/components/CommonModalContent'
import { CopyText, CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import Logo from '@/components/Logo'
import MenuList, { MenuListProps } from '@/components/MenuList'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { getLinkedEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { useUnlinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey, truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import urlJoin from 'url-join'
import { useAccount, useDisconnect } from 'wagmi'
import { CustomConnectButton } from '../../modals/login/CustomConnectButton'
import { useSignMessageAndLinkEvmAddress } from '../../modals/login/utils'

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
  | 'link-evm-address'
  | 'evm-linking-error'
  | 'unlink-evm-confirmation'
  | 'evm-address-linked'

type ContentProps = {
  address: string
  setCurrentState: React.Dispatch<React.SetStateAction<ModalState>>
  notification?: NotificationControl
  evmAddress?: string
}
const modalContents: {
  [key in ModalState]: (props: ContentProps) => JSX.Element
} = {
  account: AccountContent,
  'private-key': PrivateKeyContent,
  logout: LogoutContent,
  'share-session': ShareSessionContent,
  about: AboutContent,
  'link-evm-address': LinkEvmAddressContent,
  'evm-linking-error': EvmLoginError,
  'unlink-evm-confirmation': UnlinkEvmConfirmationContent,
  'evm-address-linked': CommonEvmAddressLinked,
}

export default function ProfileModal({
  address,
  notification,
  ...props
}: ProfileModalProps) {
  const [currentState, setCurrentState] = useState<ModalState>('account')
  const { data: linkedEvmAddress } = getLinkedEvmAddressQuery.useQuery(address)
  const { disconnect } = useDisconnect()

  useEffect(() => {
    if (!linkedEvmAddress) {
      disconnect()
    }
    if (props.isOpen) setCurrentState('account')
  }, [props.isOpen])

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
    'link-evm-address': {
      title: linkedEvmAddress ? '🔑 My EVM address' : '🔑 Link EVM Address',
      desc: 'Create an on-chain proof to link your Grill account, allowing you to use and display NFTs, and interact with ERC20s and smart contracts. ',
      withBackButton: true,
    },
    'evm-linking-error': {
      title: '😕 Something went wrong',
      desc: 'This might be related to the transaction signature. You can try again, or come back to it later.',
      withBackButton: false,
    },
    'unlink-evm-confirmation': {
      title: '🤔 Unlink EVM address?',
      desc: undefined,
      withBackButton: false,
    },
    'evm-address-linked': {
      title: '🎉 EVM address linked',
      desc: `Now you can use all of Grill's EVM features such as ERC-20 tokens, NFTs, and other smart contracts.`,
      withBackButton: false
    },
  }

  const onBackClick = () => setCurrentState('account')
  const { title, desc, withBackButton } = modalTitles[currentState] || {}
  const Content = modalContents[currentState]

  const isAccountState = currentState === 'account'

  return (
    <Modal
      {...props}
      title={title}
      description={desc}
      contentClassName={cx(isAccountState && 'px-0 pb-0')}
      titleClassName={cx(isAccountState && 'px-6')}
      withFooter={isAccountState}
      withCloseButton
      onBackClick={withBackButton ? onBackClick : undefined}
      closeModal={() => {
        props.closeModal()
      }}
    >
      <Content
        address={address}
        setCurrentState={setCurrentState}
        notification={notification}
        evmAddress={linkedEvmAddress}
      />
    </Modal>
  )
}

function AccountContent({
  address,
  setCurrentState,
  notification,
  evmAddress,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const { disconnect } = useDisconnect()

  const onLinkEvmAddressClick = () => {
    sendEvent('click link_evm_address')
    setCurrentState('link-evm-address')
  }
  const onShowPrivateKeyClick = () => {
    sendEvent('click show_private_key_button')
    setCurrentState('private-key')
  }
  const onShareSessionClick = () => {
    sendEvent('click share_session_button')
    setCurrentState('share-session')
  }
  const onLogoutClick = () => {
    disconnect()
    sendEvent('click log_out_button')
    setCurrentState('logout')
  }
  const onAboutClick = () => {
    sendEvent('click about_app_button')
    setCurrentState('about')
  }

  const menus: MenuListProps['menus'] = [
    {
      text: evmAddress ? 'My EVM Address' : 'Link EVM address',
      icon: EthIcon,
      onClick: () => {
        notification?.setNotifDone()
        onLinkEvmAddressClick()
      },
    },
    {
      text: (
        <span>
          <span>Show grill secret key</span>
          {notification?.showNotif && (
            <span className='relative ml-2 h-2 w-2'>
              <span className='absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-background-warning opacity-75'></span>
              <span className='relative block h-full w-full rounded-full bg-background-warning' />
            </span>
          )}
        </span>
      ),
      icon: KeyIcon,
      onClick: () => {
        notification?.setNotifDone()
        onShowPrivateKeyClick()
      },
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
      <ProfilePreview
        address={address}
        evmAddress={evmAddress}
        className='border-b border-background-lightest px-6 pb-6'
      />
      <MenuList menus={menus} />
    </div>
  )
}

function LinkEvmAddressContent({ evmAddress, setCurrentState }: ContentProps) {
  const { address: addressFromExt } = useAccount()

  const addressFromExtLovercased = addressFromExt?.toLowerCase()

  const isNotEqAddresses =
    !!addressFromExtLovercased &&
    !!evmAddress &&
    evmAddress !== addressFromExtLovercased

  const { signAndLinkEvmAddress, isLoading } = useSignMessageAndLinkEvmAddress({
    setModalStep: () => setCurrentState('evm-address-linked'),
    onError: () => setCurrentState('evm-linking-error'),
    linkedEvmAddress: evmAddress,
  })

  const connectionButton = (
    <CustomConnectButton
      className={cx('w-full', { ['mt-4']: isNotEqAddresses })}
      signAndLinkEvmAddress={signAndLinkEvmAddress}
      signAndLinkOnConnect={!isNotEqAddresses}
      isLoading={isLoading}
      label={isNotEqAddresses ? 'Link another account' : undefined}
      variant={isNotEqAddresses ? 'primaryOutline' : 'primary'}
    />
  )

  return (
    <div>
      {evmAddress ? (
        <div>
          <div className='flex justify-between'>
            <CopyTextInline
              text={truncateAddress(evmAddress)}
              tooltip='Copy my EVM address'
              tooltipPlacement='top'
              textToCopy={evmAddress}
              textClassName='font-mono'
            />
            <LinkText
              openInNewTab
              href={`https://etherscan.io/address/${evmAddress}`}
              variant='primary'
            >
              <span className='flex items-center'>
                Etherscan <ExternalLinkIcon className='ml-2 text-text-muted' />
              </span>
            </LinkText>
          </div>
          {isNotEqAddresses && connectionButton}
          <Button
            onClick={() => setCurrentState('unlink-evm-confirmation')}
            className='mt-6 w-full border-red-500'
            variant='primaryOutline'
            size='lg'
          >
            Unlink EVM address
          </Button>
        </div>
      ) : (
        connectionButton
      )}
    </div>
  )
}

function UnlinkEvmConfirmationContent({
  setCurrentState,
  evmAddress,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const {
    mutate: unlinkEvmAddress,
    onCallbackLoading,
    isLoading,
  } = useUnlinkEvmAddress(() => setCurrentState('link-evm-address'))

  const onButtonClick = () => {
    setCurrentState('link-evm-address')
    sendEvent(`click keep-evm-address-linked`)
  }

  const onDisconnectClick = () => {
    if (!evmAddress) return
    sendEvent('click unlink-evm-address')
    unlinkEvmAddress({ evmAddress })
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onButtonClick}>
        No, keep it linked
      </Button>
      <Button
        size='lg'
        onClick={onDisconnectClick}
        variant='primaryOutline'
        className='border-red-500'
        isLoading={onCallbackLoading || isLoading}
      >
        Yes, unlink
      </Button>
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
        Grill secret key is like a long password. We recommend keeping it in a
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
      <AboutGrillDesc className='text-text-muted' />
      <div className='rounded-2xl border border-background-warning px-4 py-2 text-text-warning'>
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

function EvmLoginError({ setCurrentState, evmAddress }: ContentProps) {
  return (
    <CommonEVMLoginErrorContent
      setModalStep={() => setCurrentState('link-evm-address')}
      onError={() => setCurrentState('evm-linking-error')}
      signAndLinkOnConnect={!evmAddress}
    />
  )
}
