import { createUserId } from '@/services/api/mutation'
import { type BrowserClient } from '@amplitude/analytics-types'
import { useParentData } from './parent'
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

const queuedEvents: { name: string; properties?: Record<string, string> }[] = []

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
  sendEvent: async (name: string, properties?: Record<string, string>) => {
    const { amp, userId } = get()
    const { event } = await import('nextjs-google-analytics')

    const { parentOrigin } = useParentData.getState()
    const commonProperties = { from: parentOrigin }
    const mergedProperties = {
      ...commonProperties,
      ...properties,
    }

    if (!amp) queuedEvents.push({ name, properties: mergedProperties })
    else amp?.logEvent(name, mergedProperties)

    event(name, {
      userId,
    })
  },
  init: async () => {
    const { createAmplitudeInstance } = await import('@/analytics/amplitude')
    const amp = await createAmplitudeInstance()

    set({ amp })
    queuedEvents.forEach(({ name, properties }) => {
      amp?.logEvent(name, properties)
    })
  },
}))

export function useSendEvent() {
  const sendEvent = useAnalytics((state) => state.sendEvent)
  return sendEvent
}
