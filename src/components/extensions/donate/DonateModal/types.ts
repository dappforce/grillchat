import { ModalFunctionalityProps } from '@/components/modals/Modal'

export type DonateModalStep = 'donate-form' | 'wallet-action-required'

export type DonateProps = DonateModalProps & {
  setCurrentStep: (currentStep: DonateModalStep) => void
  currentStep: DonateModalStep
}

export type DonateModalContent = {
  [key in DonateModalStep]: (props: DonateProps) => JSX.Element
}

export type DonateModalProps = ModalFunctionalityProps & {
  recipient: string
  messageId: string
  chatId: string
}
