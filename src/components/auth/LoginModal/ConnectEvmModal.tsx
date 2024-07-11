import EvmConnectionImage from '@/assets/graphics/evm-connection.png'
import Button from '@/components/Button'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useProfileModal } from '@/stores/profile-modal'
import Image from 'next/image'
import { SiEthereum } from 'react-icons/si'

export default function ConnectEvmModal(props: ModalFunctionalityProps) {
  const openProfileModal = useProfileModal.use.openModal()

  return (
    <Modal
      {...props}
      withCloseButton
      title='Connect Your Ethereum address to Get Rewards'
      description='Only users with a connected Ethereum address will be able to receive and manage their rewards on the platform. It also allows you to use features such as donations and NFTs, display your identity, and much more.'
    >
      <div className='flex flex-col gap-8'>
        <Image src={EvmConnectionImage} alt='' className='w-full' />
        <Button
          size='lg'
          className='flex items-center justify-center gap-2'
          onClick={() => {
            props.closeModal()
            openProfileModal({ defaultOpenState: 'add-evm-provider' })
          }}
        >
          <SiEthereum className='text-lg text-text-muted-on-primary' />
          <span>Connect wallet</span>
        </Button>
      </div>
    </Modal>
  )
}
