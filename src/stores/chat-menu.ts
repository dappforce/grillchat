import { create } from './utils'

let enableOpen = true

type State = {
  openedChatId: string | null
}

type Actions = {
  setOpenedChatId: (chatId: string | null) => void
}

const INITIAL_STATE: State = {
  openedChatId: null,
}

export const useChatMenu = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  setOpenedChatId: (openedChatId) => {
    if (!enableOpen) return

    if (!openedChatId) {
      enableOpen = false
      setTimeout(() => {
        enableOpen = true
      }, 500)
    }
    set({ openedChatId })
  },
}))
