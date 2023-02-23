import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import CopyText from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import React, { useEffect, useState } from 'react'

type ProfileModalProps = ModalFunctionalityProps & {
  address: string
}

type ModalState = 'account' | 'private-key'
const modalTitles: { [key in ModalState]: React.ReactNode } = {
  account: <span className='font-medium'>My Account</span>,
  'private-key': '🔑 Private key',
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
      <CopyText text={address} />
      <Button
        className='mt-2 w-full'
        size='lg'
        onClick={() => setCurrentState('private-key')}
      >
        Show private key
      </Button>
      <Button className='w-full' size='lg' variant='primaryOutline'>
        Log out
      </Button>
    </div>
  )
}

function PrivateKeyContent({ address, setCurrentState }: ContentProps) {
  return (
    <div className='mt-2 flex flex-col items-center gap-4'>
      <CopyText
        type='long'
        text='0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f'
      />
      <p className='mt-2 text-text-muted'>
        A private key is like a long password. We recommend keeping it in a safe
        place, so you can recover your account.
      </p>
    </div>
  )
}
