import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
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
export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  login: async (secretKey, isInitialization) => {
    const { _syncSessionKey, _getSecretKeyForLogin } = get()
    const { toSubsocialAddress } = await import('@subsocial/utils')
    let address: string = ''
    try {
      secretKey = secretKey || (await _getSecretKeyForLogin())

      const signer = await loginWithSecretKey(secretKey)
      const encodedSecretKey = encodeSecretKey(secretKey)
      address = toSubsocialAddress(signer.address)!
      set({
        address,
        signer,
        encodedSecretKey,
        isInitializedAddress: !!isInitialization,
      })
      localStorage.setItem(ACCOUNT_STORAGE_KEY, encodedSecretKey)
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

    const { getSubsocialApi } = await import('@/subsocial-query/subsocial')

    const subsocialApi = await getSubsocialApi()
    const substrateApi = await subsocialApi.substrateApi
    const unsub = substrateApi.query.energy.energyBalance(
      address,
      (energyAmount) => {
        const parsedEnergy = parseFloat(energyAmount.toPrimitive().toString())
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

    localStorage.removeItem(ACCOUNT_STORAGE_KEY)
    set({ ...initialState, _isNewSessionKey: false, _currentSessionSecretKey })
  },
  _getSecretKeyForLogin: async () => {
    const { _isNewSessionKey, _currentSessionSecretKey } = get()
    if (_isNewSessionKey) return _currentSessionSecretKey
    const { secretKey } = await generateAccount()
    return secretKey
  },
  _setSessionKey: async ({ address, encodedSecretKey, isNewSecretKey }) => {
    const { toSubsocialAddress } = await import('@subsocial/utils')
    const secretKey = decodeSecretKey(encodedSecretKey)
    const isNewSessionKey =
      isNewSecretKey === undefined ? get()._isNewSessionKey : isNewSecretKey
    set({
      _currentSessionSecretKey: secretKey,
      _isNewSessionKey: isNewSessionKey,
    })
    localStorage.setItem(SESSION_STORAGE_KEY, encodedSecretKey)
    useAnalytics.getState().setUserId(toSubsocialAddress(address)!)
  },
  _syncSessionKey: async () => {
    const { encodedSecretKey, address, _setSessionKey } = get()
    if (encodedSecretKey && address) {
      _setSessionKey({ encodedSecretKey, address })
    }
  },
  _syncSessionWithLocalStorage: async () => {
    const { _setSessionKey } = get()
    const encodedSecretKey = localStorage.getItem(SESSION_STORAGE_KEY)
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

    const encodedSecretKey = localStorage.getItem(ACCOUNT_STORAGE_KEY)
    if (encodedSecretKey) {
      const secretKey = decodeSecretKey(encodedSecretKey)
      await login(secretKey, true)
    } else {
      await _syncSessionWithLocalStorage()
    }
    set({ isInitialized: true })
  },
}))
