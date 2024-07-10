import { create, createSelectors } from './utils'

type State = {
  isOpen: boolean
  chatId?: string
  address?: string
  hubId?: string
  messageId?: string
}

type Actions = {
  closeModal: () => void
  openModal: (config?: Omit<State, 'isOpen'>) => void
}

const initialState: State = {
  isOpen: false,
  chatId: undefined,
  address: undefined,
  hubId: undefined,
  messageId: undefined,
}

const useProfilePostsModalBase = create<State & Actions>()((set) => ({
  ...initialState,
  openModal: (config) => {
    set({ isOpen: true, ...config })
  },
  closeModal: () => {
    set(initialState)
  },
}))
export const useProfilePostsModal = createSelectors(useProfilePostsModalBase)
