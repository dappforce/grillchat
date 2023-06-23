import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Modal from '@/components/modals/Modal'
import { isTouchDevice } from '@/utils/device'
import Image from 'next/image'
import { getConnector, openMobileWallet } from '../api/utils'
import { DonateProps } from './types'

type WalletActionRequiredModalStep = 'wallet-action-required' | 'add-network'

type ModalHeader = {
  [key in WalletActionRequiredModalStep]: {
    title: React.ReactNode
    desc?: React.ReactNode
  }
}

const modalHeader: ModalHeader = {
  'add-network': {
    title: '🔐 Add Polygon to Metamask',
    desc: (
      <>
        You need to add Polygon Network to your Metamask account.{' '}
        <LinkText
          openInNewTab
          href='https://autofarm.gitbook.io/autofarm-network/how-tos/use-autofarm-in-different-chains/polygon-chain-matic/metamask-add-polygon-matic-network'
          variant='primary'
        >
          How to add Polygon to Metamask?
        </LinkText>
      </>
    ),
  },
  'wallet-action-required': {
    title: '🔐 Wallet Action Required',
    desc: 'Please open your EVM wallet and perform the necessary actions to ensure its optimal functionality.',
  },
}

function WalletActionRequiredModal({ currentStep, ...props }: DonateProps) {
  const onButtonClick = async () => {
    const connector = getConnector()
    await openMobileWallet({ connector })
  }

  const { title, desc } =
    modalHeader[currentStep as WalletActionRequiredModalStep]

  return (
    <Modal {...props} title={title} description={desc}>
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
