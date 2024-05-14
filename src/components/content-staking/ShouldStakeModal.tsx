import SubsocialTokenImage from '@/assets/graphics/subsocial-tokens-large.png'
import Button from '@/components/Button'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { CONTENT_STAKING_LINK } from '@/constants/links'
import Image from 'next/image'
import Modal from '../modals/Modal'

export default function ShouldStakeModal({
  ...props
}: ModalFunctionalityProps) {
  return (
    <Modal
      {...props}
      title='Wait a sec...'
      description='In this app, every like is more than just a thumbs-up! When you like a post, both you and the author can earn extra SUB tokens. For this, you need to start locking SUB tokens first.'
      withCloseButton
    >
      <div className='flex flex-col items-center gap-6'>
        <Image
          src={SubsocialTokenImage}
          alt='subsocial'
          className='w-100'
          style={{ maxWidth: '250px' }}
        />
        <Button
          className='w-full'
          size='lg'
          href={CONTENT_STAKING_LINK}
          target='_blank'
          rel='noopener noreferrer'
        >
          Start Locking SUB
        </Button>
      </div>
    </Modal>
  )
}
