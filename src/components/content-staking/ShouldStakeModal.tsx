import Button from '@/components/Button'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import Modal from '../modals/Modal'

export default function ShouldStakeModal({
  ...props
}: ModalFunctionalityProps) {
  return (
    <Modal
      {...props}
      title='Mint Your EPIC NFT To Start Earning!'
      description='To be eligible for rewards, you need to mint at least one NFT Ticket.'
      withCloseButton
    >
      <div className='flex flex-col items-center gap-6'>
        <Button
          className='w-full'
          size='lg'
          href='https://epicapp.net/what-is-meme2earn'
          target='_blank'
          rel='noopener noreferrer'
        >
          Mint NFT Ticket
        </Button>
      </div>
    </Modal>
  )
}
