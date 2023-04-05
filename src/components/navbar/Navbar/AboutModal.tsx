import LinkText from '@/components/LinkText'
import Logo from '@/components/Logo'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'

export type AboutModalProps = ModalFunctionalityProps

export default function AboutModal({ ...props }: AboutModalProps) {
  return (
    <Modal {...props} title='About app' withCloseButton>
      <div className='flex justify-center'>
        <Logo className='text-5xl' />
      </div>
      <p className='text-text-muted'>
        Engage in discussions anonymously without fear of social persecution.
        Grill.chat runs on the{' '}
        <LinkText href='/' variant='primary'>
          xSocial
        </LinkText>{' '}
        blockchain and backs up its content to
        <LinkText href='https://ipfs.tech/' variant='primary'>
          IPFS
        </LinkText>
        .
      </p>
    </Modal>
  )
}
