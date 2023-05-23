import AboutGrillDesc from '@/components/AboutGrillDesc'
import Button from '@/components/Button'
import CaptchaTermsAndService from '@/components/captcha/CaptchaTermsAndService'
import Logo from '@/components/Logo'
import Modal, { ModalProps } from '@/components/modals/Modal'
import { LocalStorage } from '@/utils/storage'
import { useRef, useState } from 'react'

export type WelcomeModalProps = Omit<
  ModalProps,
  'isOpen' | 'closeModal' | 'title' | 'description' | 'children'
>

const STORAGE_KEY = 'dismissed-welcome-modal'
const storage = new LocalStorage(() => STORAGE_KEY)

export default function WelcomeModal({ ...props }: WelcomeModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [openModal, setOpenModal] = useState(true)

  if (storage.get() === 'true') return null

  const closeModal = () => {
    storage.set('true')
    setOpenModal(false)
  }

  return (
    <Modal
      {...props}
      isOpen={openModal}
      closeModal={closeModal}
      initialFocus={buttonRef}
      title={
        <div className='mt-4 flex flex-col items-center'>
          <Logo className='text-5xl' />
          <p className='mt-5 text-center'>👋 Welcome to GrillChat</p>
        </div>
      }
      description={<AboutGrillDesc className='block text-center' />}
    >
      <Button ref={buttonRef} onClick={closeModal} size='lg' className='mt-2'>
        Go to chats!
      </Button>
      <CaptchaTermsAndService className='mt-6 text-center' />
    </Modal>
  )
}
