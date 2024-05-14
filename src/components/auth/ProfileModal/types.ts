import React from 'react'

export const profileModalStates = [
  'account',
  'profile-settings',
  'linked-accounts',
  'privacy-security',
  'private-key',
  'logout',
  'share-session',
  'about',
  'notifications',
  'telegram-notifications',
  'push-notifications',
  'wallet-action-required',
  'loading-tx',
  'create-chat',
  'create-chat-loading',
] as const

export type ProfileModalState = (typeof profileModalStates)[number]

export type ProfileModalContentProps = {
  address: string
  setCurrentState: (
    state: React.SetStateAction<ProfileModalState>,
    forceFlowBackTo?: ProfileModalState
  ) => void
  closeModal: () => void
}
