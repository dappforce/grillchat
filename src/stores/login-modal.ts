import { LoginModalStep } from '@/components/auth/LoginModal/LoginModalContent'
// import { useMyAccount } from './my-account'
import { create, createSelectors } from './utils'

type State = {
  isOpen: boolean
  initialOpenState: LoginModalStep | undefined
  defaultOpenState: LoginModalStep | undefined
  openedNextStepModal:
    | undefined
    | { step: 'save-grill-key'; provider: SupportedExternalProvider }
    | { step: 'create-profile' }
    | { step: 'connect-evm' }
}

type Actions = {
  setIsOpen: (isOpen: boolean, initialOpenState?: LoginModalStep) => void
  setDefaultOpenState: (defaultOpenState: LoginModalStep) => void
  openNextStepModal: (modal: State['openedNextStepModal']) => void
  closeNextStepModal: () => void
}

const initialState: State = {
  isOpen: false,
  initialOpenState: undefined,
  defaultOpenState: undefined,
  openedNextStepModal: undefined,
}

export const supportedExternalProviders = [
  'x',
  'google',
  'evm',
  'polkadot',
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
      set({ isOpen: false })
      return
    }
    set({ isOpen, initialOpenState })
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
