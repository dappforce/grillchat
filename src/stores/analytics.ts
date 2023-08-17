import { createUserId } from '@/services/api/mutation'
import { LocalStorage } from '@/utils/storage'
import { type BaseEvent, type BrowserClient } from '@amplitude/analytics-types'
import { useParentData } from './parent'
import { create } from './utils'

const DEVICE_ID_STORAGE_KEY = 'device_id'
const deviceIdStorage = new LocalStorage(() => DEVICE_ID_STORAGE_KEY)

type EventProperties = {
  /// The source in Grill from which the event was sent
  eventSource?: string
  hubId?: string
  chatId?: string
  chatOwner?: boolean
  wpNotifsAllowed?: boolean
  [key: string]: any
}

type UserProperties = {
  cameFrom?: string
  cohortDate?: Date
  pwaInstalled?: boolean
  evmLinked?: boolean
  tgNotifsConnected?: boolean
  webNotifsEnabled?: boolean
  ownedChat?: boolean
  hasJoinedChats?: boolean
}

type State = {
  amp: BrowserClient | null
  userId: string | undefined
  deviceId: string | undefined
}
type Actions = {
  sendEvent: (
    name: string,
    eventProperties?: EventProperties,
    userProperties?: UserProperties
  ) => void
  removeUserId: () => void
  setUserId: (address: string) => void
  _updateUserId: (address: string | undefined) => void
}

const queuedEvents: BaseEvent[] = []

const initialState: State = {
  amp: null,
  userId: undefined,
  deviceId: undefined,
}

export const useAnalytics = create<State & Actions>()((set, get) => {
  return {
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
    sendEvent: async (
      name: string,
      eventProperties?: EventProperties,
      userProperties?: UserProperties
    ) => {
      const { amp, userId, deviceId } = get()

      const { parentOrigin } = useParentData.getState()
      const commonProperties = { from: parentOrigin }
      const mergedEventProperties = {
        ...commonProperties,
        ...eventProperties,
      }

      const eventProps = {
        event_type: name,
        event_properties: mergedEventProperties,
        user_properties: userProperties,
        user_id: userId,
        device_id: deviceId,
      }

      if (!amp) queuedEvents.push(eventProps)
      else amp?.logEvent(eventProps)
    },
    init: async () => {
      const { createAmplitudeInstance } = await import('@/analytics/amplitude')
      const amp = await createAmplitudeInstance()

      // TODO: need to test
      let deviceId = deviceIdStorage.get() || undefined

      if (!deviceId) {
        deviceId = amp?.getDeviceId()
      }

      set({ amp, deviceId })
      queuedEvents.forEach((props) => {
        amp?.logEvent(props)
      })
    },
  }
})

export function useSendEvent() {
  const sendEvent = useAnalytics((state) => state.sendEvent)
  return sendEvent
}
