import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button from '@/components/Button'
import { ListItem } from '@/components/inputs/SelectInput'
import LinkText from '@/components/LinkText'
import Modal from '@/components/modals/Modal'
import { useExtensionModalState } from '@/stores/extension'
import { isTouchDevice } from '@/utils/device'
import Image from 'next/image'
import { DonateProps } from './types'

type WalletActionRequiredModalStep = 'wallet-action-required' | 'add-network'

type ModalHeader = {
  [key in WalletActionRequiredModalStep]: {
    title: React.ReactNode
    desc?: React.ReactNode
  }
}

const addNetworkLink: Record<string, string> = {
  polygon:
    'https://autofarm.gitbook.io/autofarm-network/how-tos/use-autofarm-in-different-chains/polygon-chain-matic/metamask-add-polygon-matic-network',
  moonbeam:
    'https://moonbeam.network/tutorial/how-to-connect-metamask-to-moonbeam/',
}

const getModalHeader = (
  selectedChain: ListItem,
  currentStep: WalletActionRequiredModalStep
) => {
  const modalHeader: ModalHeader = {
    'add-network': {
      title: `🔐 Add ${selectedChain.label} to wallet`,
      desc: (
        <>
          You need to add {selectedChain.label} Network to your wallet.{' '}
          <LinkText
            openInNewTab
            href={addNetworkLink[selectedChain.id]}
            variant='primary'
          >
            How do I add {selectedChain.label}?
          </LinkText>
        </>
      ),
    },
    'wallet-action-required': {
      title: '🔐 Wallet Action Required',
      desc: 'Please open your wallet to continue',
    },
  }

  return modalHeader[currentStep]
}

function WalletActionRequiredModal({ currentStep, chainState }: DonateProps) {
  const { isOpen, closeModal } = useExtensionModalState('subsocial-donations')
  const [selectedChain] = chainState

  const onButtonClick = async () => {
    // const connector = getConnector()
    // await openMobileWallet({ connector })
  }

  const { title, desc } = getModalHeader(
    selectedChain,
    currentStep as WalletActionRequiredModalStep
  )

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title={title}
      description={desc}
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
