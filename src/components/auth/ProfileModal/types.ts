import React from 'react'

export type ProfileModalState =
  | 'account'
  | 'linked-addresses'
  | 'profile-settings'
  | 'privacy-security'
  | 'private-key'
  | 'logout'
  | 'share-session'
  | 'about'
  | 'notifications'
  | 'telegram-notifications'
  | 'push-notifications'
  | 'wallet-action-required'
  | 'loading-tx'
  | 'create-chat'
  | 'create-chat-loading'

export type ProfileModalContentProps = {
  address: string
  setCurrentState: (
    state: React.SetStateAction<ProfileModalState>,
    forceFlowBackTo?: ProfileModalState
  ) => void
  closeModal: () => void
  evmAddress?: string | null
}
