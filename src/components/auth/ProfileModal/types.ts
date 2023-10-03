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
  | 'subsocial-profile'
  | 'substrate-connect'
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
