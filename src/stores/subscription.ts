import { create } from './utils'

type SubscriptionState = 'dynamic' | 'always-sub'
type State = {
  postSubscriptionState: SubscriptionState
}

type Actions = {
  setPostSubscriptionState: (state: SubscriptionState) => void
}

const INITIAL_STATE: State = {
  postSubscriptionState: 'dynamic',
}

export const useSubscriptionState = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  setPostSubscriptionState: (postSubscriptionState) =>
    set({ postSubscriptionState }),
}))
