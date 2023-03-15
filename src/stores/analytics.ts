import { createAmplitudeInstance } from '@/analytics/amplitude'
import { createUserId } from '@/services/api/mutations'
import { BrowserClient } from '@amplitude/analytics-types'
import { event } from 'nextjs-google-analytics'
import { create } from './utils'

type State = {
  amp: BrowserClient | null
  userId: string | undefined
}
type Actions = {
  sendEvent: (name: string, properties?: Record<string, string>) => void
  removeUserId: () => void
  setUserId: (address: string) => void
  _updateUserId: (address: string | undefined) => void
}

const initialState: State = {
  amp: null,
  userId: undefined,
}

export const useAnalytics = create<State & Actions>()((set, get) => ({
  ...initialState,
  _updateUserId: async (address: string | undefined) => {
    const { amp } = get()
    if (address) {
      const userId = await createUserId(address)
      amp?.setUserId(userId)
      set({ userId })
    } else {
      amp?.setUserId(undefined)
      set({ userId: undefined })
    }
  },
  removeUserId: () => {
    const { _updateUserId } = get()
    _updateUserId(undefined)
  },
  setUserId: (address: string) => {
    const { _updateUserId } = get()
    _updateUserId(address)
  },
  sendEvent: (name: string, properties?: Record<string, string>) => {
    const { amp, userId } = get()
    amp?.logEvent(name, properties)
    event(name, {
      userId,
      category: properties ? JSON.stringify(properties) : undefined,
    })
  },
  init: async () => {
    const amp = await createAmplitudeInstance()
    set({ amp })
  },
}))

export function useSendEvent() {
  const sendEvent = useAnalytics((state) => state.sendEvent)
  return sendEvent
}
