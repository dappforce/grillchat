import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Poligon from '@/assets/graphics/chains/poligon.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import MATIC from '@/assets/graphics/tokens/matic.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'
import { ListItem } from '@/components/inputs/SelectInput'
import { useEffect, useState } from 'react'
import { useConnectOrSwitchNetwork } from '../api/hooks'
import DonateForm from './DonateForm'
import { DonateModalContent, DonateModalProps, DonateModalStep } from './types'
import WalletActionRequiredModal from './WalletActionRequiredModal'

export const chainItems = [
  {
    id: 'polygon',
    icon: Poligon,
    label: 'Polygon',
  },
  {
    id: 'astar',
    icon: Astar,
    label: 'Astar',
    disabledItem: true,
  },
  {
    id: 'moonbeam',
    icon: Moonbeam,
    label: 'Moonbeam',
    disabledItem: true,
  },
]

export const tokensItems = [
  {
    id: 'usdt',
    icon: USDT,
    label: 'USDT',
  },
  {
    id: 'usdc',
    icon: USDC,
    label: 'USDC',
  },
  {
    id: 'matic',
    icon: MATIC,
    label: 'MATIC',
    isNativeToken: true,
  },
  {
    id: 'eth',
    icon: ETH,
    label: 'ETH',
  },
]

export const modalByStep: DonateModalContent = {
  'donate-form': DonateForm,
  'wallet-action-required': WalletActionRequiredModal,
}

export default function DonateModals(props: DonateModalProps) {
  const [currentStep, setCurrentStep] = useState<DonateModalStep>('donate-form')
  const chainState = useState<ListItem>(chainItems[0])
  const tokenState = useState<ListItem>(tokensItems[0])
  const { connectOrSwitch } = useConnectOrSwitchNetwork(
    setCurrentStep,
    chainState[0].id
  )

  useEffect(() => {
    setCurrentStep('donate-form')
  }, [])

  const onSwitchButtonClick = async () => {
    connectOrSwitch()
  }

  const ModalByStep = modalByStep[currentStep]

  return (
    <ModalByStep
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      chainState={chainState}
      tokenState={tokenState}
      onSwitchButtonClick={onSwitchButtonClick}
      {...props}
    />
  )
}
