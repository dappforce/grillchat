import { extensionInitialDataTypes } from '@/components/extensions/config'
import { PostContentExtension } from '@subsocial/api/types'
import { create } from './utils'

type State = {
  _extensionModalStates: {
    [key in PostContentExtension['id']]?: {
      isOpen: boolean
      initialData: unknown
    }
  }
}

type Actions = {
  closeExtensionModal: (id: PostContentExtension['id']) => void
  openExtensionModal: <Id extends PostContentExtension['id']>(
    id: Id,
    initialData: (typeof extensionInitialDataTypes)[Id]
  ) => void
}

const INITIAL_STATE: State = {
  _extensionModalStates: {},
}

export const useExtensionData = create<State & Actions>()((set, get) => ({
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

export function useIsExtensionModalOpen<Id extends PostContentExtension['id']>(
  id: Id
) {
  return useExtensionData(
    (state) => state._extensionModalStates[id]?.isOpen ?? false
  )
}

export function useExtensionModalInitialData<
  Id extends PostContentExtension['id']
>(id: Id) {
  return (
    useExtensionData(
      (state) =>
        state._extensionModalStates[id]?.initialData as
          | (typeof extensionInitialDataTypes)[Id]
    ) || extensionInitialDataTypes[id]
  )
}

export function useCloseExtensionModal<Id extends PostContentExtension['id']>(
  id: Id
) {
  const closeExtensionModal = useExtensionData(
    (state) => state.closeExtensionModal
  )

  return () => closeExtensionModal(id)
}

export function useExtensionModalState<Id extends PostContentExtension['id']>(
  id: Id
) {
  const isOpen = useIsExtensionModalOpen(id)
  const closeModal = useCloseExtensionModal(id)

  const initialData = useExtensionModalInitialData(id)

  return {
    isOpen,
    closeModal,
    initialData,
  }
}
