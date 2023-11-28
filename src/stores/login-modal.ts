import { create } from './utils'

type State = {
  isOpen: boolean
}

type Actions = {
  setIsOpen: (isOpen: boolean) => void
}

const initialState: State = {
  isOpen: false,
}

export const useLoginModal = create<State & Actions>()((set) => ({
  ...initialState,
  setIsOpen: (isOpen) => {
    set({ isOpen })
  },
}))
