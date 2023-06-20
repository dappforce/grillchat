import { ListItem } from '@/components/inputs/SelectInput'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { Dispatch, SetStateAction } from 'react'

export type DonateModalStep = 'donate-form' | 'wallet-action-required'

export type DonateProps = DonateModalProps & {
  setCurrentStep: (currentStep: DonateModalStep) => void
  currentStep: DonateModalStep
  chainState: [ListItem, Dispatch<SetStateAction<ListItem>>]
  tokenState: [ListItem, Dispatch<SetStateAction<ListItem>>]
  onSwitchButtonClick: () => void
}

export type DonateModalContent = {
  [key in DonateModalStep]: (props: DonateProps) => JSX.Element
}

export type DonateModalProps = ModalFunctionalityProps & {
  recipient: string
  messageId: string
  chatId: string
}
