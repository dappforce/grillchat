import Button from '@/components/Button'
import CaptchaTermsAndService from '@/components/captcha/CaptchaTermsAndService'
import LinkText from '@/components/LinkText'
import Logo from '@/components/Logo'
import Modal, { ModalProps } from '@/components/Modal'
import { LocalStorage } from '@/utils/storage'
import { useState } from 'react'

export type WelcomeModalProps = Omit<
  ModalProps,
  'isOpen' | 'closeModal' | 'title' | 'description' | 'children'
>

const STORAGE_KEY = 'dismissed-welcome-modal'
const storage = new LocalStorage(() => STORAGE_KEY)

export default function WelcomeModal({ ...props }: WelcomeModalProps) {
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
      title={
        <div className='flex flex-col items-center'>
          <Logo className='text-5xl' />
          <p className='mt-5 text-center'>👋 Welcome to GrillChat</p>
        </div>
      }
      description={
        <span className='block text-center'>
          Engage in discussions anonymously without fear of social persecution.
          Grill.chat runs on the{' '}
          <LinkText
            variant='primary'
            href='https://subsocial.network/xsocial'
            openInNewTab
          >
            xSocial
          </LinkText>{' '}
          blockchain and backs up its content to{' '}
          <LinkText openInNewTab href='https://ipfs.tech' variant='primary'>
            IPFS
          </LinkText>
          .
        </span>
      }
    >
      <Button onClick={closeModal} size='lg' className='mt-2'>
        Let&apos;s go!
      </Button>
      <CaptchaTermsAndService className='mt-6 text-center' />
    </Modal>
  )
}
