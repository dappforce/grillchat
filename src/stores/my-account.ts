import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  isSecretKeyUsingMiniSecret,
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
  _subscribeEnergy: (isRetrying?: boolean) => Promise<void>
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
      } else {
        if (secretKey.startsWith('0x')) {
          const augmented = secretKey.substring(2)
          if (isSecretKeyUsingMiniSecret(augmented)) {
            secretKey = augmented
          }
        }
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
      accountAddressStorage.set(address)
      get()._subscribeEnergy()

      useAnalytics.getState().setUserId(signer.address)
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return address
  },
  _subscribeEnergy: async (isRetrying) => {
    const { address, _unsubscribeEnergy } = get()
    _unsubscribeEnergy()
    if (!address) return

    const { getSubsocialApi } = await import(
      '@/subsocial-query/subsocial/connection'
    )

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    if (!substrateApi.isConnected && !isRetrying) {
      await substrateApi.disconnect()
      await substrateApi.connect()
    }

    if (!substrateApi.isConnected) {
      // If energy subscription is run when the api is not connected, even after some more ms it connect, the subscription won't work
      // Here we wait for some delay because the api is not connected immediately even after awaiting the connect() method.
      // And we retry it recursively after 500ms delay until it's connected (without reconnecting the api again)
      await wait(500)
      return get()._subscribeEnergy(true)
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
