import { loginWithSecretKey, Signer } from '@/utils/account'
import { useAnalytics } from './analytics'
import { create } from './utils'

type State = {
  isInitialized?: boolean
  isInitializedAddress?: boolean
  address: string | null
  signer: Signer | null
  energy: number | null
  unsubscribeEnergy: () => void
  secretKey: string | null
}
type Actions = {
  login: (secretKey: string) => Promise<boolean>
  logout: () => void
  subscribeEnergy: () => Promise<void>
}

const STORAGE_KEY = 'account'

const initialState = {
  isInitializedAddress: false,
  address: null,
  signer: null,
  energy: null,
  unsubscribeEnergy: () => undefined,
  secretKey: null,
}
export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey: string) => {
    const { toSubsocialAddress } = await import('@subsocial/utils')
    try {
      const signer = await loginWithSecretKey(secretKey)
      set({
        address: toSubsocialAddress(signer.address),
        signer,
        secretKey,
        isInitializedAddress: false,
      })
      localStorage.setItem(STORAGE_KEY, secretKey)
      get().subscribeEnergy()
      useAnalytics.getState().setUserId(signer.address)
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return true
  },
  subscribeEnergy: async () => {
    const { address, unsubscribeEnergy } = get()
    unsubscribeEnergy()
    if (!address) return

    const { getSubsocialApi } = await import('@/subsocial-query/subsocial')

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const unsub = substrateApi.query.energy.energyBalance(
      address,
      (energyAmount) => {
        const parsedEnergy = parseFloat(energyAmount.toPrimitive().toString())
        set({
          energy: parsedEnergy,
          unsubscribeEnergy: () => unsub.then((unsub) => unsub()),
        })
      }
    )
  },
  logout: () => {
    const { unsubscribeEnergy, isInitialized } = get()
    unsubscribeEnergy()

    localStorage.removeItem(STORAGE_KEY)
    set(initialState)

    if (isInitialized) {
      useAnalytics.getState().removeUserId()
    }
  },
  init: async () => {
    const { isInitialized, login } = get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    const secretKey = localStorage.getItem(STORAGE_KEY)
    if (secretKey) {
      await login(secretKey)
    }
    set({ isInitialized: true, isInitializedAddress: true })
  },
}))
