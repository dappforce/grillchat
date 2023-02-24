import Button from '@/components/Button'
import Logo from '@/components/Logo'
import Modal, { ModalProps } from '@/components/Modal'
import { useState } from 'react'

export type WelcomeModalProps = Omit<
  ModalProps,
  'isOpen' | 'closeModal' | 'title' | 'description' | 'children'
>

export default function WelcomeModal({ ...props }: WelcomeModalProps) {
  const [openModal, setOpenModal] = useState(true)
  const closeModal = () => setOpenModal(false)

  return (
    <Modal
      {...props}
      isOpen={openModal}
      closeModal={closeModal}
      title={
        <div className='flex flex-col items-center'>
          <Logo className='text-5xl' />
          <p className='mt-5 text-center'>👋 Welcome to GrillChat</p>
        </div>
      }
      description={
        <span className='text-center'>
          Engage in discussions without fear of social persecution, as GrillChat
          is censorship-resistant.
        </span>
      }
    >
      <Button onClick={closeModal} size='lg' className='mt-2'>
        Let&apos;s go!
      </Button>
    </Modal>
  )
}
