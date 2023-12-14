import { LoginModalStep } from '@/components/auth/LoginModal/LoginModalContent'
import { getUrlQuery } from '@/utils/links'
import { useMyAccount } from './my-account'
import { create } from './utils'

type State = {
  isOpen: boolean
  initialOpenState?: LoginModalStep
}

type Actions = {
  setIsOpen: (isOpen: boolean, initialOpenState?: LoginModalStep) => void
}

const initialState: State = {
  isOpen: false,
  initialOpenState: undefined,
}

export const useLoginModal = create<State & Actions>()((set) => ({
  ...initialState,
  setIsOpen: (isOpen, initialOpenState) => {
    if (!isOpen) {
      const { isTemporaryAccount, logout } = useMyAccount.getState()
      if (isTemporaryAccount) logout()
      set({ isOpen: false })
      return
    }
    set({ isOpen, initialOpenState })
  },
  init: () => {
    const loginQuery = getUrlQuery('login')
    if (loginQuery === 'x') {
      set({ isOpen: true, initialOpenState: 'x-login-loading' })
    }
  },
}))
