import { ModalFunctionalityProps } from '@/components/modals/Modal'

type NotificationControl = {
  showNotif: boolean
  setNotifDone: () => void
}

export type ProfileModalProps = ModalFunctionalityProps & {
  address: string
  notification?: NotificationControl
  step?: ModalState
}

export type ModalState =
  | 'account'
  | 'subsocial-profile'
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
  setCurrentState: React.Dispatch<React.SetStateAction<ModalState>>
  notification?: NotificationControl
  evmAddress?: string | null
}
