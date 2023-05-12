import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
import { getWeb3AuthClientId } from '@/utils/env/client'
import { generateRandomName } from '@/utils/random-name'
import { LocalStorage } from '@/utils/storage'
import { SubstrateRPC } from '@/utils/substrate-rpc'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { useAnalytics } from './analytics'
import { create } from './utils'

const clientId = getWeb3AuthClientId()

type AuthenticatedUser = {
  name: string
  encodedSecretKey: string
  address: string
  profilePic: string
  email?: string
  username?: string
}

type State = {
  web3Auth: Web3Auth | null
  authenticatedUser: AuthenticatedUser | null
  provider: SafeEventEmitterProvider | null
  authMethod: AUTHENTICATION_METHODS
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
  isAuthenticated?: boolean
  loginAnonymously: (
    secretKey?: string,
    isInitialization?: boolean
  ) => Promise<string | false>
  initializeWeb3Auth: () => Promise<Web3Auth>
  login: () => Promise<void>
  logout: () => Promise<void>
  getPrivateKey: () => Promise<string | undefined>
  _subscribeEnergy: () => Promise<void>
  _setSessionKey: (session: Session) => Promise<void>
  _syncSessionKey: () => Promise<void>
  _syncSessionWithLocalStorage: () => Promise<void>
  _getSecretKeyForLogin: () => Promise<string>
}

enum AUTHENTICATION_METHODS {
  Web3Auth,
  Anonymous,
}
const ACCOUNT_STORAGE_KEY = 'account'
const SESSION_STORAGE_KEY = 'session'

const initialState: State = {
  isInitializedAddress: true,
  authenticatedUser: null,
  provider: null,
  web3Auth: null,
  authMethod: AUTHENTICATION_METHODS.Anonymous,
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
  initializeWeb3Auth: async () => {
    const web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        // chainId: '0x5',
        // rpcTarget: 'https://rpc.ankr.com/eth_goerli',
      },
      web3AuthNetwork: 'testnet',
    })
    web3auth.initModal()
    if (web3auth.provider) {
      set({
        provider: web3auth.provider,
      })
    }
    set({
      web3Auth: web3auth,
    })
    return web3auth
  },
  loginAnonymously: async (secretKey, isInitialization) => {
    const { _syncSessionKey, _getSecretKeyForLogin } = get()
    let address: string = ''
    try {
      secretKey = secretKey || (await _getSecretKeyForLogin())

      const signer = await loginWithSecretKey(secretKey)
      const encodedSecretKey = encodeSecretKey(secretKey)
      address = signer.address
      const randomPicture = createAvatar(bottts, {
        size: 128,
        seed: address,
      }).toDataUriSync()
      const name = generateRandomName(address)
      const authenticatedUser = {
        profilePic: randomPicture,
        address,
        encodedSecretKey,
        name,
      } as AuthenticatedUser
      set({
        address,
        signer,
        encodedSecretKey,
        authenticatedUser,
        isAuthenticated: true,
        authMethod: AUTHENTICATION_METHODS.Anonymous,
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
  login: async () => {
    let {
      web3Auth,
      initializeWeb3Auth,
      getPrivateKey,
      _syncSessionKey,
      _subscribeEnergy,
    } = get()
    if (!web3Auth) {
      web3Auth = await initializeWeb3Auth()
    }
    const web3authProvider = await web3Auth.connect()

    set(() => ({
      provider: web3authProvider,
    }))

    const privateKey = await getPrivateKey()
    if (privateKey) {
      const signer = await loginWithSecretKey(decodeSecretKey(privateKey))

      /// We could ans should rely on the user profile as displayed by Web3Auth as it gives us a better idea of who logged in
      /// Possible ways would be to use IPFS to update the logged in user on first login and using the web3Auth generated private key,
      /// we could ensure only the private has access to update the IPFS profile.
      /// For now, we use anonymouse profile for every logged in use.
      // const user = await web3Auth.getUserInfo()

      const randomPicture = createAvatar(bottts, {
        size: 128,
        seed: signer.address,
      }).toDataUriSync()
      const name = generateRandomName(signer.address)
      const authenticatedUser = {
        name: name,
        profilePic: randomPicture,
        address: signer.address,
        encodedSecretKey: privateKey,
      } as AuthenticatedUser
      set(() => ({
        signer,
        address: signer.address,
        isAuthenticated: true,
        authenticatedUser,
        authMethod: AUTHENTICATION_METHODS.Web3Auth,
        encodedSecretKey: privateKey,
      }))
      accountStorage.set(privateKey)
      await _subscribeEnergy()
      _syncSessionKey()
    }
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
    if (authMethod === AUTHENTICATION_METHODS.Web3Auth) {
      const { web3Auth } = get()
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
      isAuthenticated: false,
      authenticatedUser: null,
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
  getPrivateKey: async () => {
    const { provider } = get()
    if (!provider) {
      console.log('Provider not set!')
      return undefined
    }

    const rpc = new SubstrateRPC(provider)
    const [private_key, address] = await rpc.getPrivateKey()
    set({
      encodedSecretKey: private_key,
      address,
    })
    return private_key
  },
}))
