import React from 'react'
import { PolkadotConnectSteps } from '../common/polkadot-connect/types'

type NotificationControl = {
  showNotif: boolean
  setNotifDone: () => void
}

export type ProfileModalProps = {
  notification?: NotificationControl
}

export type ProfileModalState =
  | PolkadotConnectSteps
  | 'account'
  | 'linked-addresses'
  | 'profile-settings'
  | 'polkadot-connect-unlink'
  | 'polkadot-connect-identity-removed'
  | 'private-key'
  | 'logout'
  | 'share-session'
  | 'about'
  | 'link-evm-address'
  | 'evm-linking-error'
  | 'unlink-evm-confirmation'
  | 'evm-address-linked'
  | 'evm-set-profile-suggestion'
  | 'notifications'
  | 'telegram-notifications'
  | 'push-notifications'
  | 'withdraw-tokens'

export type ProfileModalContentProps = {
  address: string
  setCurrentState: (
    state: React.SetStateAction<ProfileModalState>,
    forceFlowBackTo?: ProfileModalState
  ) => void
  closeModal: () => void
  notification?: NotificationControl
  evmAddress?: string | null
}
