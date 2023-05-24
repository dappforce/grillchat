import { LocalStorage } from '@/utils/storage'
import { create } from './utils'

const MESSAGE_COUNT_STORAGE_KEY = 'message-count'
const messageCountStorage = new LocalStorage(
  (origin: string) => `${MESSAGE_COUNT_STORAGE_KEY}:${origin}`
)

type State = {
  currentOrigin: string
  messageCount: number
}

type Actions = {
  incrementMessageCount: () => void
}

const INITIAL_STATE: State = {
  currentOrigin: '',
  messageCount: 0,
}

export const useMessageData = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  incrementMessageCount: () => {
    const { currentOrigin, messageCount } = get()
    if (!currentOrigin) return

    const incrementedCount = messageCount + 1
    messageCountStorage.set(incrementedCount.toString(), currentOrigin)
    set({ messageCount: incrementedCount })
  },
  init: () => {
    const currentOrigin =
      window.parent?.location.origin ?? window.location.origin

    let messageCount = parseInt(messageCountStorage.get(currentOrigin) || '0')
    if (isNaN(messageCount)) messageCount = 0

    set({ currentOrigin, messageCount })
  },
}))
