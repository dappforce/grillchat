import { extensionModalStates } from '@/components/extensions/config'
import { LocalStorage } from '@/utils/storage'
import { PostContentExtension } from '@subsocial/api/types'
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

  _extensionModalStates: {
    [key in PostContentExtension['id']]?: {
      isOpen: boolean
      initialData: unknown | null
    }
  }

  showEmptyPrimaryChatInput: boolean
}

type Actions = {
  incrementMessageCount: () => void
  setMessageBody: (message: string) => void
  setReplyTo: (replyTo: string) => void
  clearReplyTo: () => void
  setShowEmptyPrimaryChatInput: (show: boolean) => void
  closeExtensionModal: (id: PostContentExtension['id']) => void
  openExtensionModal: <Id extends PostContentExtension['id']>(
    id: Id,
    initialData?: (typeof extensionModalStates)[Id]
  ) => void
}

const INITIAL_STATE: State = {
  messageCount: 0,
  messageBody: '',
  replyTo: '',
  showEmptyPrimaryChatInput: false,
  _extensionModalStates: {},
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
  closeExtensionModal: (id) => {
    set({
      _extensionModalStates: {
        ...get()._extensionModalStates,
        [id]: {
          isOpen: false,
          initialData: null,
        },
      },
    })
  },
  openExtensionModal: (id, initialData) => {
    set({
      _extensionModalStates: {
        ...get()._extensionModalStates,
        [id]: {
          isOpen: true,
          initialData: initialData ?? null,
        },
      },
    })
  },
  init: () => {
    const { parentOrigin } = useParentData.getState()

    let messageCount = parseInt(messageCountStorage.get(parentOrigin) || '0')
    if (isNaN(messageCount)) messageCount = 0

    set({ messageCount })
  },
}))

export function useIsExtensionModalOpen<Id extends PostContentExtension['id']>(
  id: Id
) {
  return useMessageData(
    (state) => state._extensionModalStates[id]?.isOpen ?? false
  )
}

export function useIsExtensionModalInitialData<
  Id extends PostContentExtension['id']
>(id: Id) {
  return useMessageData(
    (state) =>
      state._extensionModalStates[id]?.initialData as
        | (typeof extensionModalStates)[Id]
        | null
  )
}
