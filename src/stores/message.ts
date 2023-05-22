import { LocalStorage } from '@/utils/storage'
import { create } from './utils'

const MESSAGE_COUNT_STORAGE_KEY = 'message-count'
const messageCountStorage = new LocalStorage(
  (origin: string) => `${MESSAGE_COUNT_STORAGE_KEY}:${origin}`
)

type State = {
  currentOrigin: string
  parentOriginMessageCounts: Record<string, number>
}

type Actions = {
  incrementMessageCount: () => void
}

const INITIAL_STATE: State = {
  currentOrigin: '',
  parentOriginMessageCounts: {},
}

export const useMessageData = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  incrementMessageCount: () => {
    const { currentOrigin, parentOriginMessageCounts } = get()
    if (!currentOrigin) return

    const count = parentOriginMessageCounts[currentOrigin] || 0
    const incrementedCount = count + 1

    messageCountStorage.set(incrementedCount.toString(), currentOrigin)
    set({
      parentOriginMessageCounts: {
        ...parentOriginMessageCounts,
        [currentOrigin]: incrementedCount,
      },
    })
  },
  init: () => {
    const currentOrigin =
      window.parent?.location.origin ?? window.location.origin
    set({ currentOrigin })
  },
}))

export function useMessageCount() {
  const messageCount = useMessageData(
    (state) =>
      state.parentOriginMessageCounts[state.currentOrigin] as number | undefined
  )
  return messageCount
}
