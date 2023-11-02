import { ProfileModalState } from '@/components/auth/ProfileModal/types'
import { create } from './utils'

type State = {
  isOpen: boolean
  defaultOpenState?: ProfileModalState
  onBackClick?: () => void
}

type Actions = {
  closeModal: () => void
  openModal: (config?: {
    onBackClick?: () => void
    defaultOpenState?: ProfileModalState
  }) => void
}

const initialState: State = {
  isOpen: false,
  defaultOpenState: undefined,
}

export const useProfileModal = create<State & Actions>()((set) => ({
  ...initialState,
  openModal: (config) => {
    set({ isOpen: true, ...config })
  },
  closeModal: () => {
    set(initialState)
  },
}))
