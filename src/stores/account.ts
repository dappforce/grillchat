import { loginWithSecretKey } from '@/utils/account'
import { Signer } from '@/utils/types'
import { create } from 'zustand'

interface MyAccountState {
  address: string | null
  signer: Signer | null
  secretKey: string | null
  login: (secretKey: string) => Promise<boolean>
}
export const useMyAccount = create<MyAccountState>()((set) => ({
  address: null,
  signer: null,
  secretKey: null,
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
}))
