import { sendMessageToParentWindow } from '@/utils/window'
import { create, createSelectors } from './utils'

export type CreateChatModalState =
  | 'new-comunity'
  | 'create-chat'
  | 'update-chat'
  | 'loading'

type State = {
  isOpen: boolean
  defaultOpenState?: CreateChatModalState
  customInternalStepProps?: any
  onBackClick?: () => void
}

type Actions = {
  closeModal: () => void
  openModal: (config?: {
    onBackClick?: () => void
    defaultOpenState?: CreateChatModalState
    customInternalStepProps?: any
  }) => void
  clearInternalProps: () => void
}

const initialState: State = {
  isOpen: false,
  defaultOpenState: undefined,
}

const useCreateChatModalBase = create<State & Actions>()((set) => ({
  ...initialState,
  openModal: (config) => {
    set({ isOpen: true, ...config })
  },
  clearInternalProps: () => {
    set({ customInternalStepProps: undefined })
  },
  closeModal: () => {
    sendMessageToParentWindow('create-chat', 'close')
    set(initialState)
  },
}))
export const useCreateChatModal = createSelectors(useCreateChatModalBase)
