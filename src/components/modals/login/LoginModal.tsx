import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { SyntheticEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Toast from '../../Toast'
import { loginModalContents, LoginModalStep } from './LoginModalContent'

export type LoginModalProps = ModalFunctionalityProps & {
  afterLogin?: () => void
  beforeLogin?: () => void
  openModal: () => void
}

type ModalTitle = {
  [key in LoginModalStep]: {
    title: React.ReactNode
    desc: React.ReactNode
    withBackButton: boolean
  }
}

const modalHeader: ModalTitle = {
  login: {
    title: '🔐 Login',
    desc: '',
    withBackButton: false,
  },
  'enter-secret-key': {
    title: '🔑 Grill secret key',
    desc: 'To access GrillChat, you need a Grill secret key. If you do not have one, just write your first chat message, and you will be given one.',
    withBackButton: true,
  },
  'account-created': {
    title: '🎉 Account created',
    desc: 'We have created an anonymous account for you. You can now use grill.chat or connect your traditional Web3 wallet to it. ',
    withBackButton: false
  }
}

export default function LoginModal({
  afterLogin,
  beforeLogin,
  ...props
}: LoginModalProps) {
  const login = useMyAccount((state) => state.login)
  const [privateKey, setPrivateKey] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [currentStep, setCurrentStep] = useState<LoginModalStep>('login')

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
          description='The Grill secret key you provided is not valid'
        />
      ))
    }
  }

  const onBackClick = () => setCurrentStep('login')

  const ModalContent = loginModalContents[currentStep]
  const { title, desc, withBackButton } = modalHeader[currentStep]

  return (
    <Modal
      {...props}
      withFooter
      initialFocus={isTouchDevice() ? undefined : inputRef}
      title={title}
      withCloseButton
      description={desc}
      onBackClick={withBackButton ? onBackClick : undefined}
      closeModal={() => {
        props.closeModal()
      }}
    >
      <CaptchaInvisible>
        {(runCaptcha, termsAndService) => {
          return (
            <ModalContent
              onSubmit={onSubmit}
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              runCaptcha={runCaptcha}
              termsAndService={termsAndService}
              {...props}
            />
          )
        }}
      </CaptchaInvisible>
    </Modal>
  )
}
