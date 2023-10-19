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
  | 'linked-addresses'
  | 'subsocial-profile'
  | 'polkadot-connect'
  | 'polkadot-connect-account'
  | 'polkadot-connect-confirmation'
  | 'polkadot-connect-success'
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
  | 'notifications'
  | 'telegram-notifications'
  | 'push-notifications'

export type ContentProps = {
  address: string
  setCurrentState: React.Dispatch<React.SetStateAction<ProfileModalState>>
  notification?: NotificationControl
  evmAddress?: string | null
}
