import { create } from './utils'

type SubscriptionType = 'post' | 'identity'
type SubscriptionState = 'dynamic' | 'always-sub'
type State = {
  subscriptionState: Record<SubscriptionType, SubscriptionState>
}

type Actions = {
  setSubscriptionState: (
    type: SubscriptionType,
    state: SubscriptionState
  ) => void
}

const INITIAL_STATE: State = {
  subscriptionState: {
    identity: 'dynamic',
    post: 'dynamic',
  },
}

export const useSubscriptionState = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  setSubscriptionState: (type, state) =>
    set({ subscriptionState: { ...get().subscriptionState, [type]: state } }),
}))
