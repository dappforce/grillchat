import { LoginModalStep } from '@/components/auth/LoginModal/LoginModalContent'
// import { useMyAccount } from './my-account'
import { create, createSelectors } from './utils'

type State = {
  isOpen: boolean
  initialOpenState: LoginModalStep | undefined
  defaultOpenState: LoginModalStep | undefined
  solMessageProofInfo: {
    message: string
    signature: string
  }
  openedNextStepModal:
    | undefined
    | {
        step: 'save-grill-key'
        provider: SupportedExternalProvider
        onFinish?: () => void
      }
    | { step: 'create-profile' }
    | { step: 'connect-evm' }
}

type Actions = {
  setIsOpen: (isOpen: boolean, initialOpenState?: LoginModalStep) => void
  setDefaultOpenState: (defaultOpenState: LoginModalStep) => void
  openNextStepModal: (modal: State['openedNextStepModal']) => void
  setSolMessageProofInfo: (message: string, signature: string) => void
  closeNextStepModal: () => void
}

const initialState: State = {
  isOpen: false,
  initialOpenState: undefined,
  defaultOpenState: undefined,
  openedNextStepModal: undefined,
  solMessageProofInfo: {
    message: '',
    signature: '',
  },
}

export const supportedExternalProviders = [
  'x',
  'google',
  'evm',
  'polkadot',
  'solana',
] as const
export type SupportedExternalProvider =
  (typeof supportedExternalProviders)[number]
const useLoginModalBase = create<State & Actions>()((set, get) => ({
  ...initialState,
  setIsOpen: (isOpen, initialOpenState) => {
    if (!initialOpenState) {
      initialOpenState = get().defaultOpenState
    }

    if (!isOpen) {
      // const { isTemporaryAccount, logout } = useMyAccount.getState()
      // if (isTemporaryAccount) logout()
      set({ isOpen: false, defaultOpenState: undefined })
      return
    }
    set({ isOpen, initialOpenState })
  },
  setSolMessageProofInfo: (message: string, signature: string) => {
    set({ solMessageProofInfo: { message, signature } })
  },
  setDefaultOpenState: (defaultOpenState) => {
    set({ defaultOpenState })
  },
  openNextStepModal: (modal) => {
    set({ openedNextStepModal: modal })
  },
  closeNextStepModal: () => {
    set({ openedNextStepModal: undefined })
  },
}))
export const useLoginModal = createSelectors(useLoginModalBase)
