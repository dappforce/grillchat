import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import CopyText from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import React, { useEffect, useState } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi'

type ProfileModalProps = ModalFunctionalityProps & {
  address: string
}

type ModalState = 'account' | 'private-key' | 'logout'
const modalTitles: {
  [key in ModalState]: (onBackClick?: () => void) => React.ReactNode
} = {
  account: () => <span className='font-medium'>My Account</span>,
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
  logout: () => '🤔 Did you back up your private key?',
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
}

export default function ProfileModal({ address, ...props }: ProfileModalProps) {
  const [currentState, setCurrentState] = useState<ModalState>('account')

  useEffect(() => {
    if (props.isOpen) setCurrentState('account')
  }, [props.isOpen])

  const onBackClick = () => setCurrentState('account')
  const title = modalTitles[currentState]?.(onBackClick)
  const Content = modalContents[currentState]

  return (
    <Modal {...props} title={title} withCloseButton>
      <Content address={address} setCurrentState={setCurrentState} />
    </Modal>
  )
}

function AccountContent({ address, setCurrentState }: ContentProps) {
  const sendEvent = useSendEvent()
  const onShowPrivateKeyClick = () => {
    sendEvent('click show_private_key_button')
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('click log_out_button')
    setCurrentState('logout')
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <AddressAvatar address={address} className='h-20 w-20' />
      <CopyText text={truncateAddress(address)} textToCopy={address} />
      <div className='mt-4 flex w-full flex-col gap-3'>
        <Button className='w-full' size='lg' onClick={onShowPrivateKeyClick}>
          Show private key
        </Button>
        <Button
          variant='primaryOutline'
          className='w-full'
          size='lg'
          onClick={onShowPrivateKeyClick}
        >
          Suggest Feature
        </Button>
        <Button
          className='w-full'
          size='lg'
          variant='transparent'
          onClick={onLogoutClick}
        >
          Log out
        </Button>
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
      <CopyText
        onCopyClick={onCopyClick}
        type='long'
        isCodeText
        text={secretKey || ''}
      />
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
