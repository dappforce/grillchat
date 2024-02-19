import { LoginModalStep } from '@/components/auth/LoginModal/LoginModalContent'
import { getUrlQuery } from '@/utils/links'
import { useMyAccount } from './my-account'
import { create } from './utils'

type State = {
  isOpen: boolean
  initialOpenState?: LoginModalStep
  defaultOpenState?: LoginModalStep
}

type Actions = {
  setIsOpen: (isOpen: boolean, initialOpenState?: LoginModalStep) => void
  setDefaultOpenState: (defaultOpenState: LoginModalStep) => void
}

const initialState: State = {
  isOpen: false,
  initialOpenState: undefined,
  defaultOpenState: undefined,
}

export const useLoginModal = create<State & Actions>()((set, get) => ({
  ...initialState,
  setIsOpen: (isOpen, initialOpenState) => {
    if (!initialOpenState) {
      initialOpenState = get().defaultOpenState
    }

    if (!isOpen) {
      const { isTemporaryAccount, logout } = useMyAccount.getState()
      if (isTemporaryAccount) logout()
      set({ isOpen: false })
      return
    } else if (
      initialOpenState === 'polkadot-connect' &&
      useMyAccount.getState().preferredWallet
    ) {
      initialOpenState = 'polkadot-connect-account'
    }
    set({ isOpen, initialOpenState })
  },
  setDefaultOpenState: (defaultOpenState) => {
    set({ defaultOpenState })
  },
  init: () => {
    const loginQuery = getUrlQuery('login')
    if (loginQuery === 'x') {
      set({ isOpen: true, initialOpenState: 'x-login-loading' })
    } else if (loginQuery === 'google') {
      set({ isOpen: true, initialOpenState: 'google-login-loading' })
    }
  },
}))
