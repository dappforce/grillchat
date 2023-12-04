import { LoginModalStep } from '@/components/auth/LoginModal/LoginModalContent'
import { getUrlQuery } from '@/utils/links'
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
      set({ isOpen: false })
      return
    }
    set({ isOpen, initialOpenState })
  },
  init: () => {
    const loginQuery = getUrlQuery('login')
    console.log(loginQuery)
    if (loginQuery === 'x') {
      set({ isOpen: true, initialOpenState: 'x-login-loading' })
    }
  },
}))
