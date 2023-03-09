import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import CopyText from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import React, { useEffect, useState } from 'react'

type ProfileModalProps = ModalFunctionalityProps & {
  address: string
}

type ModalState = 'account' | 'private-key' | 'logout'
const modalTitles: { [key in ModalState]: React.ReactNode } = {
  account: <span className='font-medium'>My Account</span>,
  'private-key': '🔑 Private key',
  logout: '🤔 Did you back up your private key?',
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

  const title = modalTitles[currentState]
  const Content = modalContents[currentState]

  return (
    <Modal {...props} title={title} withCloseButton>
      <Content address={address} setCurrentState={setCurrentState} />
    </Modal>
  )
}

function AccountContent({ address, setCurrentState }: ContentProps) {
  return (
    <div className='mt-2 flex flex-col items-center gap-4'>
      <AddressAvatar address={address} className='h-20 w-20' />
      <CopyText text={truncateAddress(address)} textToCopy={address} />
      <Button
        className='mt-2 w-full'
        size='lg'
        onClick={() => setCurrentState('private-key')}
      >
        Show private key
      </Button>
      <Button
        className='w-full'
        size='lg'
        variant='primaryOutline'
        onClick={() => setCurrentState('logout')}
      >
        Log out
      </Button>
    </div>
  )
}

function PrivateKeyContent() {
  const secretKey = useMyAccount((state) => state.secretKey)

  return (
    <div className='mt-2 flex flex-col items-center gap-4'>
      <CopyText type='long' text={secretKey || ''} />
      <p className='mt-2 text-text-muted'>
        A private key is like a long password. We recommend keeping it in a safe
        place, so you can recover your account.
      </p>
    </div>
  )
}

function LogoutContent({ setCurrentState }: ContentProps) {
  const logout = useMyAccount((state) => state.logout)

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={() => setCurrentState('private-key')}>
        No, show me my private key
      </Button>
      <Button size='lg' onClick={logout} variant='primaryOutline'>
        Yes, log out
      </Button>
    </div>
  )
}
