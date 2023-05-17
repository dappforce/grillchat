import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
import { LocalStorage } from '@/utils/storage'
import { initializeWeb3Auth, SubstrateRPC } from '@/utils/substrate-rpc'
import { Web3Auth } from '@web3auth/modal'
import { useAnalytics } from './analytics'
import { create } from './utils'

let web3Auth: Web3Auth | null = null

type State = {
  authMethod?: AuthenticationMethods
  address: string | null
  signer: Signer | null
  energy: number | null
  encodedSecretKey: string | null
  _unsubscribeEnergy: () => void
  _currentSessionSecretKey: string
  _isNewSessionKey: boolean
  isInitialized?: boolean
  isInitializedAddress?: boolean
}

type Session = {
  encodedSecretKey: string
  address: string
  isNewSecretKey?: boolean
}
type Actions = {
  loginAnonymously: (
    secretKey?: string,
    isInitialization?: boolean
  ) => Promise<string | false>
  loginWithWeb3Auth: () => Promise<string | false>
  logout: () => Promise<void>
  _subscribeEnergy: () => Promise<void>
  _setSessionKey: (session: Session) => Promise<void>
  _syncSessionKey: () => Promise<void>
  _syncSessionWithLocalStorage: () => Promise<void>
  _getSecretKeyForLogin: () => Promise<string>
}

export type AuthenticationMethods = 'web3auth' | 'anonymous'

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
  loginAnonymously: async (secretKey, isInitialization) => {
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
        authMethod: 'anonymous',
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
  loginWithWeb3Auth: async () => {
    let { _syncSessionKey, _subscribeEnergy } = get()
    if (!web3Auth) {
      web3Auth = await initializeWeb3Auth()
    }

    if (!web3Auth!.provider) {
      console.log('Provider not set!')
      return false
    }

    const rpc = new SubstrateRPC(web3Auth!.provider)
    const { privateKey: encodedSecretKey } = await rpc.getPrivateKey()!

    if (encodedSecretKey) {
      const signer = await loginWithSecretKey(decodeSecretKey(encodedSecretKey))

      set(() => ({
        signer,
        address: signer.address,
        isAuthenticated: true,
        authMethod: 'web3auth',
        web3Auth,
        encodedSecretKey,
      }))
      accountStorage.set(encodedSecretKey)
      await _subscribeEnergy()
      _syncSessionKey()
      return signer.address
    }
    return false
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
  logout: async () => {
    const { _unsubscribeEnergy, _currentSessionSecretKey, authMethod } = get()
    _unsubscribeEnergy()

    set({ ...initialState, _isNewSessionKey: false, _currentSessionSecretKey })
    if (authMethod === 'web3auth') {
      if (!web3Auth) {
        console.log('User already logged out')
        return
      }
      await web3Auth.logout()
    }
    accountStorage.remove()
    set({
      ...initialState,
      _isNewSessionKey: false,
      _currentSessionSecretKey,
    })
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
    const { isInitialized, loginAnonymously, _syncSessionWithLocalStorage } =
      get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    const encodedSecretKey = accountStorage.get()
    let successLogin = false
    if (encodedSecretKey) {
      const secretKey = decodeSecretKey(encodedSecretKey)
      const address = await loginAnonymously(secretKey, true)

      if (address) successLogin = true
      else accountStorage.remove()
    }

    if (!successLogin) {
      await _syncSessionWithLocalStorage()
    }
    set({ isInitialized: true })
  },
}))
