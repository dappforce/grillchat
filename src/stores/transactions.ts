import { create } from './utils'

type State = {
  pendingTransactions: Set<string>
}

type Actions = {
  addPendingTransaction: (tx: string) => void
  removePendingTransaction: (tx: string) => void
}

const initialState: State = {
  pendingTransactions: new Set(),
}

export const useTransactions = create<State & Actions>()((set, get) => ({
  ...initialState,
  addPendingTransaction: (tx) => {
    const pendingTransactions = get().pendingTransactions
    pendingTransactions.add(tx)
    set({ pendingTransactions: new Set(pendingTransactions) })
  },
  removePendingTransaction: (tx) => {
    const pendingTransactions = get().pendingTransactions
    pendingTransactions.delete(tx)
    set({ pendingTransactions: new Set(pendingTransactions) })
  },
}))
