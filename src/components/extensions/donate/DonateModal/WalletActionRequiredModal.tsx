import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button from '@/components/Button'
import Modal from '@/components/modals/Modal'
import { isTouchDevice } from '@/utils/device'
import Image from 'next/image'
import { useNetwork } from 'wagmi'
import { getConnector, openMobileWallet } from '../api/utils'
import { DonateProps } from './types'

function WalletActionRequiredModal(props: DonateProps) {
  const { chains } = useNetwork()

  const onButtonClick = async () => {
    const connector = getConnector({ chains })
    await openMobileWallet({ connector })
  }

  return (
    <Modal
      {...props}
      title={'🔐 Wallet Action Required'}
      description={
        'Please open your EVM wallet and perform the necessary actions to ensure its optimal functionality.'
      }
      panelClassName='pb-5'
    >
      <div className='flex w-full flex-col items-center gap-4'>
        <Image
          className='w-64 max-w-xs rounded-full'
          priority
          src={ProcessingHumster}
          alt=''
        />

        {isTouchDevice() && (
          <Button className='w-full' size={'lg'} onClick={onButtonClick}>
            Open wallet
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default WalletActionRequiredModal
