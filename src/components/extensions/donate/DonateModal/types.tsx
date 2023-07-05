import { ListItem } from '@/components/inputs/SelectInput'
import { Dispatch, SetStateAction } from 'react'
import { ExtensionModalsProps } from '../..'

export type DonateModalStep =
  | 'donate-form'
  | 'wallet-action-required'
  | 'add-network'

export type DonateProps = DonateModalProps & {
  setCurrentStep: (currentStep: DonateModalStep) => void
  currentStep: DonateModalStep
  chainState: [ListItem, Dispatch<SetStateAction<ListItem>>]
  tokenState: [ListItem, Dispatch<SetStateAction<ListItem>>]
  onSwitchButtonClick: () => void
  onSubmit: () => void
}

export type DonateModalContent = {
  [key in DonateModalStep]: (props: DonateProps) => JSX.Element
}

export type DonateModalProps = ExtensionModalsProps
