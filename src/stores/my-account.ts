import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
import { wait } from '@/utils/promise'
import { LocalStorage } from '@/utils/storage'
import { useAnalytics } from './analytics'
import { create } from './utils'

type State = {
  isInitialized?: boolean
  isInitializedAddress?: boolean
  address: string | null
  signer: Signer | null
  energy: number | null
  encodedSecretKey: string | null
  _unsubscribeEnergy: () => void
}

type Actions = {
  login: (
    secretKey?: string,
    isInitialization?: boolean
  ) => Promise<string | false>
  logout: () => void
  _subscribeEnergy: () => Promise<void>
}

const initialState: State = {
  isInitializedAddress: true,
  address: null,
  signer: null,
  energy: null,
  encodedSecretKey: null,
  _unsubscribeEnergy: () => undefined,
}

const ACCOUNT_ADDRESS_STORAGE_KEY = 'accountPublicKey'
const ACCOUNT_STORAGE_KEY = 'account'
const FOLLOWED_IDS_STORAGE_KEY = 'followedPostIds'

export const accountAddressStorage = new LocalStorage(
  () => ACCOUNT_ADDRESS_STORAGE_KEY
)
export const followedIdsStorage = new LocalStorage(
  (address: string) => `${FOLLOWED_IDS_STORAGE_KEY}:${address}`
)
const accountStorage = new LocalStorage(() => ACCOUNT_STORAGE_KEY)

export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey, isInitialization) => {
    const { toSubsocialAddress } = await import('@subsocial/utils')
    let address: string = ''
    try {
      if (!secretKey) {
        secretKey = (await generateAccount()).secretKey
      }

      const signer = await loginWithSecretKey(secretKey)
      const encodedSecretKey = encodeSecretKey(secretKey)
      address = toSubsocialAddress(signer.address)!

      set({
        address,
        signer,
        encodedSecretKey,
        isInitializedAddress: !!isInitialization,
      })

      accountStorage.set(encodedSecretKey)
      accountAddressStorage.set(signer.address)
      get()._subscribeEnergy()

      useAnalytics.getState().setUserId(signer.address)
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return address
  },
  _subscribeEnergy: async () => {
    const { address, _unsubscribeEnergy } = get()
    _unsubscribeEnergy()
    if (!address) return

    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    if (!substrateApi.isConnected) {
      await substrateApi.disconnect()
      await substrateApi.connect()
      await wait(500)
    }

    const unsub = substrateApi.query.energy.energyBalance(
      address,
      (energyAmount) => {
        const parsedEnergy = parseFloat(energyAmount.toPrimitive().toString())
        console.log('Current energy: ', parsedEnergy)
        set({
          energy: parsedEnergy,
          _unsubscribeEnergy: () => unsub.then((unsub) => unsub()),
        })
      }
    )
  },
  logout: () => {
    const { _unsubscribeEnergy, address } = get()
    _unsubscribeEnergy()

    accountStorage.remove()
    accountAddressStorage.remove()
    if (address) followedIdsStorage.remove(address)

    set({ ...initialState })
  },
  init: async () => {
    const { isInitialized, login } = get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    const encodedSecretKey = accountStorage.get()
    if (encodedSecretKey) {
      const storageAddress = accountAddressStorage.get()
      set({ address: storageAddress || undefined })

      const secretKey = decodeSecretKey(encodedSecretKey)
      const address = await login(secretKey, true)

      if (!address) {
        accountStorage.remove()
        accountAddressStorage.remove()
        set({ address: null })
      }
    }

    set({ isInitialized: true })
  },
}))
