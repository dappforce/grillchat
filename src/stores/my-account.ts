import { getSubsocialApi } from '@/subsocial-query/subsocial'
import { loginWithSecretKey } from '@/utils/account'
import { Signer } from '@/utils/types'
import { create } from './utils'

type State = {
  isInitialized?: boolean
  address: string | null
  signer: Signer | null
  balance: number
  unsubscribeBalance: () => void
  secretKey: string | null
}
type Actions = {
  login: (secretKey: string) => Promise<boolean>
  logout: () => void
  subscribeBalance: () => Promise<void>
}

const STORAGE_KEY = 'account'

const initialState = {
  address: null,
  signer: null,
  balance: 0,
  unsubscribeBalance: () => undefined,
  secretKey: null,
}
export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey: string) => {
    const { toSubsocialAddress } = await import('@subsocial/utils')
    try {
      console.log(secretKey)
      const signer = await loginWithSecretKey(secretKey)
      set({
        address: toSubsocialAddress(signer.address),
        signer,
        secretKey,
      })
      localStorage.setItem(STORAGE_KEY, secretKey)
      get().subscribeBalance()
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return true
  },
  subscribeBalance: async () => {
    const { address, unsubscribeBalance } = get()
    unsubscribeBalance()
    if (!address) return

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const unsub = substrateApi.query.balances.account(address, (balances) => {
      const parsedBalances = balances.toPrimitive()
      const freeBalance =
        parseFloat(parsedBalances?.free as any) ?? 0 / 10 ** 10
      set({
        balance: freeBalance,
        unsubscribeBalance: () => unsub.then((unsub) => unsub()),
      })
    })
  },
  logout: () => {
    const { unsubscribeBalance } = get()
    unsubscribeBalance()

    localStorage.removeItem(STORAGE_KEY)
    set(initialState)
  },
  init: async () => {
    const { isInitialized, login } = get()
    if (isInitialized) return true

    const secretKey = localStorage.getItem(STORAGE_KEY)
    if (secretKey) {
      await login(secretKey)
      set({ isInitialized: true })
    }
    set({ isInitialized: true })
  },
}))
