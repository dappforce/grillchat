import { ListItem } from '@/components/inputs/SelectInput'
import { Dispatch, SetStateAction } from 'react'
import { ExtensionModalsProps } from '../..'

export type DonateModalStep =
  | 'donate-form'
  | 'wallet-action-required'
  | 'add-network'

export type TokenListItem = ListItem<{ isNativeToken?: boolean }>
export type DonateProps = DonateModalProps & {
  setCurrentStep: (currentStep: DonateModalStep) => void
  currentStep: DonateModalStep
  chainState: [TokenListItem, Dispatch<SetStateAction<TokenListItem>>]
  tokenState: [TokenListItem, Dispatch<SetStateAction<TokenListItem>>]
  onSwitchButtonClick: () => void
  onSubmit: () => void
}

export type DonateModalContent = {
  [key in DonateModalStep]: (props: DonateProps) => JSX.Element
}

export type DonateModalProps = ExtensionModalsProps
