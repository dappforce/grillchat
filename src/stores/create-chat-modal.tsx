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
  newChatId?: string
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
  setNewChatId: (id: string) => void
}

const initialState: State = {
  isOpen: false,
  defaultOpenState: undefined,
}

const useCreateChatModalBase = create<State & Actions>()((set, get) => ({
  ...initialState,
  openModal: (config) => {
    set({ isOpen: true, ...config })
  },
  clearInternalProps: () => {
    set({ customInternalStepProps: undefined })
  },
  setNewChatId: (id: string) => {
    const config = get()

    set({ ...config, newChatId: id })
  },
  closeModal: () => {
    sendMessageToParentWindow('create-chat', 'close')
    set(initialState)
  },
}))
export const useCreateChatModal = createSelectors(useCreateChatModalBase)
