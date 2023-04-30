import { decodeSecretKey, loginWithSecretKey, Signer } from '@/utils/account'
import { getWeb3AuthClientId } from '@/utils/env/client'
import { SubstrateRPC } from '@/utils/substrate-rpc'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base'
import { Web3Auth } from '@web3auth/modal'
import { create } from './utils'

const clientId = getWeb3AuthClientId()

type State = {
  web3Auth: Web3Auth | null
  provider: SafeEventEmitterProvider | null
  authenticatedUser?: Partial<Record<string, any>>
  signer: Signer | null
  isAuthenticated?: boolean
  encodedSecretKey?: string
  address: string | null
  energy: number | null
}

type Actions = {
  initialize: () => Promise<Web3Auth>
  login: () => Promise<void>
  logout: () => Promise<void>
  getPrivateKey: () => Promise<string | undefined>
}

const initialState: State = {
  web3Auth: null,
  provider: null,
  signer: null,
  address: null,
  energy: null,
}
export const useWeb3Auth = create<State & Actions>()((set, get) => ({
  ...initialState,
  initialize: async () => {
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
  login: async () => {
    let { web3Auth, initialize, getPrivateKey } = get()
    if (!web3Auth) {
      web3Auth = await initialize()
    }
    const web3authProvider = await web3Auth.connect()
    const user = await web3Auth.getUserInfo()

    set(() => ({
      provider: web3authProvider,
      isAuthenticated: true,
      authenticatedUser: user,
    }))

    const privateKey = await getPrivateKey()
    if (privateKey) {
      const signer = await loginWithSecretKey(decodeSecretKey(privateKey))
      set(() => ({
        signer,
        encodedSecretKey: privateKey,
      }))
    }
  },
  logout: async () => {
    const { web3Auth } = get()
    if (!web3Auth) {
      console.log('User already logged out')
      return
    }
    await web3Auth.logout()
    set({
      isAuthenticated: false,
      authenticatedUser: undefined,
      provider: null,
      web3Auth: null,
    })
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
