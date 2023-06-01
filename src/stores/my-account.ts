import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
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
  _currentSessionSecretKey: string
  _isNewSessionKey: boolean
}

type Session = {
  encodedSecretKey: string
  address: string
  isNewSecretKey?: boolean
}
type Actions = {
  login: (
    secretKey?: string,
    isInitialization?: boolean
  ) => Promise<string | false>
  logout: () => void
  _subscribeEnergy: () => Promise<void>
  _setSessionKey: (session: Session) => Promise<void>
  _syncSessionKey: () => Promise<void>
  _syncSessionWithLocalStorage: () => Promise<void>
  _getSecretKeyForLogin: () => Promise<string>
}

const ACCOUNT_STORAGE_KEY = 'account'
const SESSION_STORAGE_KEY = 'session'

const initialState: State = {
  isInitializedAddress: true,
  address: null,
  signer: null,
  energy: null,
  encodedSecretKey: null,
  _currentSessionSecretKey: '',
  _unsubscribeEnergy: () => undefined,
  _isNewSessionKey: true,
}

const accountStorage = new LocalStorage(() => ACCOUNT_STORAGE_KEY)
const currentSessionStorage = new LocalStorage(() => SESSION_STORAGE_KEY)

export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey, isInitialization) => {
    const { _syncSessionKey, _getSecretKeyForLogin } = get()
    let address: string = ''
    try {
      secretKey = secretKey || (await _getSecretKeyForLogin())
      
      const signer = await loginWithSecretKey(secretKey)
      const encodedSecretKey = encodeSecretKey(secretKey)
      address = signer.address
      set({
        address,
        signer,
        encodedSecretKey,
        isInitializedAddress: !!isInitialization,
      })
      accountStorage.set(encodedSecretKey)
      get()._subscribeEnergy()
      _syncSessionKey()
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
    const { _unsubscribeEnergy, _currentSessionSecretKey } = get()
    _unsubscribeEnergy()

    accountStorage.remove()
    set({ ...initialState, _isNewSessionKey: false, _currentSessionSecretKey })
  },
  _getSecretKeyForLogin: async () => {
    const { _isNewSessionKey, _currentSessionSecretKey } = get()
    if (_isNewSessionKey && _currentSessionSecretKey)
      return _currentSessionSecretKey

    const { secretKey } = await generateAccount()
    return secretKey
  },
  _setSessionKey: async ({ address, encodedSecretKey, isNewSecretKey }) => {
    const secretKey = decodeSecretKey(encodedSecretKey)
    const isNewSessionKey =
      isNewSecretKey === undefined ? get()._isNewSessionKey : isNewSecretKey
    set({
      _currentSessionSecretKey: secretKey,
      _isNewSessionKey: isNewSessionKey,
    })
    currentSessionStorage.set(encodedSecretKey)
    useAnalytics.getState().setUserId(address)
  },
  _syncSessionKey: async () => {
    const { encodedSecretKey, address, _setSessionKey } = get()
    if (encodedSecretKey && address) {
      _setSessionKey({ encodedSecretKey, address })
    }
  },
  _syncSessionWithLocalStorage: async () => {
    const { _setSessionKey } = get()
    const encodedSecretKey = currentSessionStorage.get()
    if (encodedSecretKey) {
      const secretKey = decodeSecretKey(encodedSecretKey)
      const signer = await loginWithSecretKey(secretKey)
      _setSessionKey({
        encodedSecretKey,
        address: signer.address,
        isNewSecretKey: false,
      })
    } else {
      const { secretKey, publicKey } = await generateAccount()
      const encodedSecretKey = encodeSecretKey(secretKey)
      _setSessionKey({
        encodedSecretKey,
        address: publicKey,
        isNewSecretKey: true,
      })
    }
  },
  init: async () => {
    const { isInitialized, login, _syncSessionWithLocalStorage } = get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    const encodedSecretKey = accountStorage.get()
    let successLogin = false
    if (encodedSecretKey) {
      const secretKey = decodeSecretKey(encodedSecretKey)
      const address = await login(secretKey, true)

      if (address) successLogin = true
      else accountStorage.remove()
    }

    if (!successLogin) {
      await _syncSessionWithLocalStorage()
    }
    set({ isInitialized: true })
  },
}))
