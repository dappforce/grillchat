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
}

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
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return true
  },
  init: () => {
    const { isInitialized, login } = get()
    if (isInitialized) return true

    const secretKey = localStorage.getItem('account')
    console.log(secretKey)
    if (secretKey) {
      set({ isInitialized: true })
      return login(secretKey)
    }
    set({ isInitialized: true })
  },
  logout: () => {
    set(initialState)
  },
}))
