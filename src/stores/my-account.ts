import { loginWithSecretKey } from '@/utils/account'
import { Signer } from '@/utils/types'
import { create } from './utils'

type State = {
  isInitialized: boolean
  address: string | null
  signer: Signer | null
  secretKey: string | null
}
type Actions = {
  login: (secretKey: string) => Promise<boolean>
  logout: () => void
}

const STORAGE_KEY = 'account'

const initialState = {
  isInitialized: false,
  address: null,
  signer: null,
  secretKey: null,
}
export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey: string) => {
    try {
      const signer = await loginWithSecretKey(secretKey)
      set({
        address: signer.address,
        signer,
        secretKey,
      })
      localStorage.setItem(STORAGE_KEY, secretKey)
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return true
  },
  logout: () => {
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
