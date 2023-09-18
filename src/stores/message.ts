import { LocalStorage } from '@/utils/storage'
import { useParentData } from './parent'
import { create } from './utils'

const MESSAGE_COUNT_STORAGE_KEY = 'message-count'
const messageCountStorage = new LocalStorage(
  (origin: string) => `${MESSAGE_COUNT_STORAGE_KEY}:${origin}`
)

type UnreadMessage = {
  lastId: string
  count: number
}
type State = {
  messageCount: number

  messageBody: string
  replyTo: string | undefined

  showEmptyPrimaryChatInput: boolean

  unreadMessage: UnreadMessage
}

type Actions = {
  incrementMessageCount: () => void
  setMessageBody: (message: string) => void
  setReplyTo: (replyTo: string) => void
  clearReplyTo: () => void
  setShowEmptyPrimaryChatInput: (show: boolean) => void
  setUnreadMessage: (
    unreadData: UnreadMessage | ((prev: UnreadMessage) => UnreadMessage)
  ) => void
}

const INITIAL_STATE: State = {
  messageCount: 0,
  messageBody: '',
  replyTo: '',
  showEmptyPrimaryChatInput: false,
  unreadMessage: {
    count: 0,
    lastId: '',
  },
}

export const useMessageData = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  setMessageBody: (messageBody: string) => {
    set({ messageBody: messageBody })
  },
  setReplyTo: (replyTo: string) => {
    set({ replyTo })
  },
  clearReplyTo: () => {
    set({ replyTo: undefined })
  },
  incrementMessageCount: () => {
    const { messageCount } = get()
    const { parentOrigin } = useParentData.getState()
    if (!parentOrigin) return

    const incrementedCount = messageCount + 1
    messageCountStorage.set(incrementedCount.toString(), parentOrigin)
    set({ messageCount: incrementedCount })
  },
  setShowEmptyPrimaryChatInput: (show: boolean) => {
    set({ showEmptyPrimaryChatInput: show })
  },
  setUnreadMessage: (unreadMessage) => {
    if (typeof unreadMessage === 'function') {
      set((state) => ({ unreadMessage: unreadMessage(state.unreadMessage) }))
      return
    }
    set({ unreadMessage })
  },
  init: () => {
    const { parentOrigin } = useParentData.getState()

    let messageCount = parseInt(messageCountStorage.get(parentOrigin) || '0')
    if (isNaN(messageCount)) messageCount = 0

    set({ messageCount })
  },
}))
