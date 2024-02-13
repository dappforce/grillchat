import {
  extensionInitialDataTypes,
  MessageExtensionIds,
} from '@/components/extensions/config'
import { create, createSelectors } from './utils'

type State = {
  _extensionModalStates: {
    [key in MessageExtensionIds]?: {
      isOpen: boolean
      initialData: unknown
    }
  }
}

type Actions = {
  closeExtensionModal: (id: MessageExtensionIds) => void
  openExtensionModal: <Id extends MessageExtensionIds>(
    id: Id,
    initialData: (typeof extensionInitialDataTypes)[Id]
  ) => void
}

const INITIAL_STATE: State = {
  _extensionModalStates: {},
}

const useExtensionDataBase = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  closeExtensionModal: (id) => {
    set({
      _extensionModalStates: {
        ...get()._extensionModalStates,
        [id]: {
          ...get()._extensionModalStates[id],
          isOpen: false,
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
}))
export const useExtensionData = createSelectors(useExtensionDataBase)

export function useIsExtensionModalOpen<Id extends MessageExtensionIds>(
  id: Id
) {
  return useExtensionData(
    (state) => state._extensionModalStates[id]?.isOpen ?? false
  )
}

export function useExtensionModalInitialData<Id extends MessageExtensionIds>(
  id: Id
) {
  return (
    useExtensionData(
      (state) =>
        state._extensionModalStates[id]?.initialData as
          | (typeof extensionInitialDataTypes)[Id]
    ) || extensionInitialDataTypes[id]
  )
}

export function useCloseExtensionModal<Id extends MessageExtensionIds>(id: Id) {
  const closeExtensionModal = useExtensionData(
    (state) => state.closeExtensionModal
  )

  return () => closeExtensionModal(id)
}

export function useExtensionModalState<Id extends MessageExtensionIds>(id: Id) {
  const isOpen = useIsExtensionModalOpen(id)
  const closeModal = useCloseExtensionModal(id)

  const initialData = useExtensionModalInitialData(id)

  return {
    isOpen,
    closeModal,
    initialData,
  }
}
