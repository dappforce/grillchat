import { useExtensionModalState } from '@/stores/extension'
import { useEffect, useState } from 'react'
import { useConnectOrSwitchNetwork } from '../api/hooks'
import DonateForm from './DonateForm'
import {
  DonateModalContent,
  DonateModalProps,
  DonateModalStep,
  TokenListItem,
} from './types'
import { chainItems, tokensItems } from './utils'
import WalletActionRequiredModal from './WalletActionRequiredModal'

export const modalByStep: DonateModalContent = {
  'donate-form': DonateForm,
  'wallet-action-required': WalletActionRequiredModal,
  'add-network': WalletActionRequiredModal,
}

export default function DonateModal(props: DonateModalProps) {
  const { isOpen } = useExtensionModalState('subsocial-donations')

  const [currentStep, setCurrentStep] = useState<DonateModalStep>('donate-form')
  const chainState = useState<TokenListItem>(chainItems[0])
  const chain = chainState[0]

  const tokenState = useState<TokenListItem>(tokensItems[chain.id][0])
  const { connectOrSwitch } = useConnectOrSwitchNetwork(
    setCurrentStep,
    chainState[0].id
  )

  useEffect(() => {
    setCurrentStep('donate-form')
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('donate-form')
    }
  }, [isOpen])

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
