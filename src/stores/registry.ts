import { useAnalytics } from './analytics'
import { useLocation } from './location'
import { useMessageData } from './message'
import { useMyAccount } from './my-account'
import { useParentData } from './parent'
import { useVersion } from './version'

// order of the registry can be important if you have dependencies between stores in the init function.
const storesRegistry = [
  useParentData,
  useAnalytics,
  useLocation,
  useMyAccount,
  useMessageData,
  useVersion,
]

export const initAllStores = () => {
  storesRegistry.forEach((store) => {
    const state = store.getState() as { init?: () => void }
    if (typeof state.init === 'function') {
      state.init()
    }
  })
}
