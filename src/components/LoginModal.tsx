import { useMyAccount } from '@/stores/my-account'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from './Button'
import Input from './inputs/Input'
import Modal, { ModalFunctionalityProps } from './Modal'
import Toast from './Toast'

export type LoginModalProps = ModalFunctionalityProps & {
  afterLogin?: () => void
  beforeLogin?: () => void
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  ...props
}: LoginModalProps) {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    beforeLogin?.()
    if (await login(privateKey)) {
      afterLogin?.()
      setPrivateKey('')
      props.closeModal()
    } else {
      toast.custom((t) => (
        <Toast
          t={t}
          title='Login Failed'
          description='The private key you provided is not valid'
        />
      ))
    }
  }

  const desc =
    'To access GrillChat, you need a private key. If you do not have one, just write your first chat message, and you will be given one.'

  return (
    <Modal
      {...props}
      initialFocus={inputRef}
      title='🔐 Login'
      withCloseButton
      description={desc}
    >
      <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
        <Input
          ref={inputRef}
          value={privateKey}
          onChange={(e) => setPrivateKey((e.target as HTMLInputElement).value)}
          placeholder='Enter your private key'
        />
        <Button disabled={!privateKey} size='lg'>
          Let&apos;s go
        </Button>
      </form>
    </Modal>
  )
}
