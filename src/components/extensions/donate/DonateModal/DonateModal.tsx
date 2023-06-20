import { useEffect, useState } from 'react'
import DonateForm from './DonateForm'
import { DonateModalContent, DonateModalProps, DonateModalStep } from './types'
import WalletActionRequiredModal from './WalletActionRequiredModal'

export const modalByStep: DonateModalContent = {
  'donate-form': DonateForm,
  'wallet-action-required': WalletActionRequiredModal,
}

export default function DonateModals(props: DonateModalProps) {
  const [currentStep, setCurrentStep] = useState<DonateModalStep>('donate-form')

  useEffect(() => {
    setCurrentStep('donate-form')
  }, [])

  const ModalByStep = modalByStep[currentStep]

  return (
    <ModalByStep
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      {...props}
    />
  )
}
