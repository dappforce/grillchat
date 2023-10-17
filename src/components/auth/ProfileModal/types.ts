import { ModalFunctionalityProps } from '@/components/modals/Modal'

type NotificationControl = {
  showNotif: boolean
  setNotifDone: () => void
}

export type ProfileModalProps = ModalFunctionalityProps & {
  notification?: NotificationControl
  step?: ProfileModalState
}

export type ProfileModalState =
  | 'account'
  | 'account-settings'
  | 'subsocial-profile'
  | 'polkadot-connect'
  | 'polkadot-connect-wallet'
  | 'polkadot-connect-account'
  | 'polkadot-connect-confirmation'
  | 'private-key'
  | 'logout'
  | 'share-session'
  | 'about'
  | 'link-evm-address'
  | 'evm-linking-error'
  | 'unlink-evm-confirmation'
  | 'evm-address-linked'
  | 'notifications'
  | 'telegram-notifications'
  | 'push-notifications'

export type ContentProps = {
  address: string
  setCurrentState: React.Dispatch<React.SetStateAction<ProfileModalState>>
  notification?: NotificationControl
  evmAddress?: string | null
}
