import { LocalStorage } from '@/utils/storage'
import { useParentData } from './parent'
import { create } from './utils'

const MESSAGE_COUNT_STORAGE_KEY = 'message-count'
const messageCountStorage = new LocalStorage(
  (origin: string) => `${MESSAGE_COUNT_STORAGE_KEY}:${origin}`
)

type State = {
  messageCount: number
}

type Actions = {
  incrementMessageCount: () => void
}

const INITIAL_STATE: State = {
  messageCount: 0,
}

export const useMessageData = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  incrementMessageCount: () => {
    const { messageCount } = get()
    const { parentOrigin } = useParentData.getState()
    if (!parentOrigin) return

    const incrementedCount = messageCount + 1
    messageCountStorage.set(incrementedCount.toString(), parentOrigin)
    set({ messageCount: incrementedCount })
  },
  init: () => {
    const { parentOrigin } = useParentData.getState()

    let messageCount = parseInt(messageCountStorage.get(parentOrigin) || '0')
    if (isNaN(messageCount)) messageCount = 0

    set({ messageCount })
  },
}))
