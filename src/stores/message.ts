import { LocalStorage } from '@/utils/storage'
import { useParentData } from './parent'
import { create } from './utils'

const MESSAGE_COUNT_STORAGE_KEY = 'message-count'
const messageCountStorage = new LocalStorage(
  (origin: string) => `${MESSAGE_COUNT_STORAGE_KEY}:${origin}`
)

type State = {
  messageCount: number

  messageBody: string
  replyTo: string | undefined

  showEmptyPrimaryChatInput: boolean
  doing: string
}

type Actions = {
  incrementMessageCount: () => void
  setMessageBody: (message: string) => void
  setReplyTo: (replyTo: string) => void
  clearReplyTo: () => void
  setShowEmptyPrimaryChatInput: (show: boolean) => void
  setDoing: (doing: string) => void
}

const INITIAL_STATE: State = {
  messageCount: 0,
  messageBody: '',
  replyTo: '',
  showEmptyPrimaryChatInput: false,
  doing: '',
}

export const useMessageData = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  setDoing: (doing: string) => {
    set({ doing })
  },
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
  init: () => {
    const { parentOrigin } = useParentData.getState()

    let messageCount = parseInt(messageCountStorage.get(parentOrigin) || '0')
    if (isNaN(messageCount)) messageCount = 0

    set({ messageCount })
  },
}))
