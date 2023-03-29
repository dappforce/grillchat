import { useMyAccount } from '@/stores/my-account'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from './Button'
import CaptchaModal from './CaptchaModal'
import TextArea from './inputs/TextArea'
import Modal, { ModalFunctionalityProps } from './Modal'
import Toast from './Toast'

export type LoginModalProps = ModalFunctionalityProps & {
  afterLogin?: () => void
  beforeLogin?: () => void
  openModal: () => void
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  ...props
}: LoginModalProps) {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isOpenCaptchaModal, setIsOpenCaptchaModal] = useState(false)

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

  const openCaptchaModal = () => {
    setIsOpenCaptchaModal(true)
    props.closeModal()
  }
  const closeCaptchaModal = () => {
    setIsOpenCaptchaModal(false)
    props.openModal()
  }

  return (
    <>
      <Modal
        {...props}
        withFooter
        initialFocus={inputRef}
        title='🔐 Login'
        withCloseButton
        description={desc}
      >
        <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
          <TextArea
            ref={inputRef}
            value={privateKey}
            rows={3}
            size='sm'
            className='bg-background'
            onChange={(e) =>
              setPrivateKey((e.target as HTMLTextAreaElement).value)
            }
            placeholder='Enter your private key'
          />
          <Button disabled={!privateKey} size='lg'>
            Login
          </Button>
          <Button
            variant='primaryOutline'
            type='button'
            size='lg'
            onClick={openCaptchaModal}
          >
            Create an account
          </Button>
        </form>
      </Modal>
      <CaptchaModal
        isOpen={isOpenCaptchaModal}
        closeModal={closeCaptchaModal}
        onSubmit={() => props.closeModal()}
      />
    </>
  )
}
