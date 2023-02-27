import { useMyAccount } from '@/stores/my-account'
import { useState } from 'react'
import Button from './Button'
import Input from './inputs/Input'
import Modal, { ModalFunctionalityProps } from './Modal'

export type LoginModalProps = ModalFunctionalityProps

export default function LoginModal({ ...props }: LoginModalProps) {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (await login(privateKey)) {
      props.closeModal()
    } else {
      // TODO: handle error
    }
  }

  return (
    <Modal {...props} title='🔐 Login' withCloseButton>
      <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
        <Input
          value={privateKey}
          onChange={(e) => setPrivateKey((e.target as HTMLInputElement).value)}
          placeholder='Enter your private key'
        />
        <Button disabled={!privateKey} size='lg'>
          Let&apos;s go
        </Button>
        <p className='mt-2 text-text-muted'>
          To access GrillChat, you need a private key. If you do not have one,
          just write your first chat message, and you will be given one.
        </p>
      </form>
    </Modal>
  )
}
