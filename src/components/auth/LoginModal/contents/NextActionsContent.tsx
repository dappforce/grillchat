import PotentialImage from '@/assets/graphics/potential.png'
import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import Image from 'next/image'
import { LoginModalContentProps } from '../LoginModalContent'

export const NextActionsContent = ({
  setCurrentState,
  closeModal,
}: LoginModalContentProps) => {
  const sendEvent = useSendEvent()

  return (
    <div className='flex flex-col'>
      <Image src={PotentialImage} alt='' className='mb-6 w-full' />
      <div className='flex flex-col gap-4'>
        <Button size='lg' onClick={() => setCurrentState('connect-wallet')}>
          Connect Addresses
        </Button>
        <Button
          size='lg'
          variant='primaryOutline'
          onClick={() => {
            closeModal()
            sendEvent('connect_addresses_skiped')
          }}
        >
          I&apos;ll do this later
        </Button>
      </div>
    </div>
  )
}
