import { useAnalytics } from './analytics'
import { useLocation } from './location'
import { useMessageData } from './message'
import { useMyAccount } from './my-account'

const storesRegistry = [useAnalytics, useLocation, useMessageData, useMyAccount]

export const initAllStores = () => {
  storesRegistry.forEach((store) => {
    const state = store.getState() as { init?: () => void }
    if (typeof state.init === 'function') {
      state.init()
    }
  })
}
