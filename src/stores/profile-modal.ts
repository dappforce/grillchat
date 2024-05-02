import { ProfileModalState } from '@/components/auth/ProfileModal/types'
import { sendMessageToParentWindow } from '@/utils/window'
import { create, createSelectors } from './utils'

type State = {
  isOpen: boolean
  defaultOpenState?: ProfileModalState
  customInternalStepProps?: any
  onBackClick?: () => void
}

type Actions = {
  closeModal: () => void
  openModal: (config?: {
    onBackClick?: () => void
    defaultOpenState?: ProfileModalState
    customInternalStepProps?: any
  }) => void
  clearInternalProps: () => void
}

const initialState: State = {
  isOpen: false,
  defaultOpenState: undefined,
}

const useProfileModalBase = create<State & Actions>()((set) => ({
  ...initialState,
  openModal: (config) => {
    set({ isOpen: true, ...config })
  },
  clearInternalProps: () => {
    set({ customInternalStepProps: undefined })
  },
  closeModal: () => {
    sendMessageToParentWindow('profile', 'close')
    set(initialState)
  },
}))
export const useProfileModal = createSelectors(useProfileModalBase)
