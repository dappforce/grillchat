import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { queryClient } from '@/services/provider'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { getOwnedPostIdsQuery } from '@/services/subsocial/posts'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useParentData } from '@/stores/parent'
import {
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  isSecretKeyUsingMiniSecret,
  loginWithSecretKey,
  Signer,
} from '@/utils/account'
import { wait } from '@/utils/promise'
import { LocalStorage, LocalStorageAndForage } from '@/utils/storage'
import { isWebNotificationsEnabled } from '@/utils/window'
import { toSubsocialAddress } from '@subsocial/utils'
import { getWallets, Wallet, WalletAccount } from '@talismn/connect-wallets'
import dayjs from 'dayjs'
import { useAnalytics, UserProperties } from './analytics'
import { create } from './utils'

type State = {
  isInitialized?: boolean
  isInitializedAddress?: boolean
  isTemporaryAccount: boolean

  preferredWallet: Wallet | null
  connectedWallet?: {
    address: string
    signer: Signer | null
    energy?: number
    _unsubscribeEnergy?: () => void
  }
  parentProxyAddress: string | undefined

  address: string | null
  signer: Signer | null
  energy: number | null
  encodedSecretKey: string | null
  _unsubscribeEnergy: () => void
}

type Actions = {
  login: (
    secretKey?: string,
    config?: { isInitialization?: boolean; asTemporaryAccount?: boolean }
  ) => Promise<string | false>
  loginAsTemporaryAccount: () => Promise<string | false>
  finalizeTemporaryAccount: () => void
  logout: () => void
  setPreferredWallet: (wallet: Wallet | null) => void
  connectWallet: (address: string, signer: Signer | null) => Promise<void>
  saveProxyAddress: () => void
  disconnectProxy: () => void
  _subscribeEnergy: () => void
  _subscribeConnectedWalletEnergy: () => void
}

const initialState: State = {
  isInitializedAddress: true,
  isTemporaryAccount: false,
  preferredWallet: null,
  parentProxyAddress: undefined,
  address: null,
  signer: null,
  energy: null,
  encodedSecretKey: null,
  _unsubscribeEnergy: () => undefined,
}

export const accountAddressStorage = new LocalStorageAndForage(
  () => 'accountPublicKey'
)
export const followedIdsStorage = new LocalStorageAndForage(
  (address: string) => `followedPostIds:${address}`
)
export const hasSentMessageStorage = new LocalStorage(() => 'has-sent-message')
const accountStorage = new LocalStorage(() => 'account')
const parentProxyAddressStorage = new LocalStorage(
  () => 'connectedWalletAddress'
)
const preferredWalletStorage = new LocalStorage(() => 'preferred-wallet')

const sendLaunchEvent = async (
  address?: string | false,
  parentProxyAddress?: string | null
) => {
  let userProperties: UserProperties = {
    tgNotifsConnected: false,
    evmLinked: false,
    polkadotLinked: !!parentProxyAddress,
    webNotifsEnabled: false,
    ownedChat: false,
  }

  const sendEvent = useAnalytics.getState().sendEvent

  if (!address) {
    sendEvent('launch_app')
  } else {
    const [linkedTgAccData, evmLinkedAddress, ownedPostIds, linkedIdentity] =
      await Promise.allSettled([
        getLinkedTelegramAccountsQuery.fetchQuery(queryClient, {
          address,
        }),
        getAccountDataQuery.fetchQuery(queryClient, address),
        getOwnedPostIdsQuery.fetchQuery(queryClient, address),
        getLinkedIdentityQuery.fetchQuery(queryClient, address),
      ] as const)

    if (linkedTgAccData.status === 'fulfilled')
      userProperties.tgNotifsConnected =
        (linkedTgAccData.value?.length || 0) > 0
    if (evmLinkedAddress.status === 'fulfilled')
      userProperties.evmLinked = !!evmLinkedAddress.value
    if (ownedPostIds.status === 'fulfilled')
      userProperties.ownedChat = (ownedPostIds.value?.length || 0) > 0
    if (linkedIdentity.status === 'fulfilled')
      userProperties.twitterLinked =
        linkedIdentity.value?.provider === IdentityProvider.Twitter

    userProperties.webNotifsEnabled = isWebNotificationsEnabled()

    sendEvent('launch_app', undefined, userProperties)
  }
}

export const useMyAccount = create<State & Actions>()((set, get) => ({
  ...initialState,
  setPreferredWallet: (wallet) => {
    set({ preferredWallet: wallet })
    if (!wallet) preferredWalletStorage.remove()
    else preferredWalletStorage.set(wallet.title)
  },
  _subscribeConnectedWalletEnergy: () => {
    const { connectedWallet } = get()
    if (!connectedWallet) return

    const { address } = connectedWallet
    const unsub = subscribeEnergy(address, (energy) => {
      const wallet = get().connectedWallet
      if (!wallet) return
      set({ connectedWallet: { ...wallet, energy } })
    })
    set({
      connectedWallet: {
        ...connectedWallet,
        _unsubscribeEnergy: () => unsub.then((unsub) => unsub?.()),
      },
    })
  },
  connectWallet: async (address, signer) => {
    const { toSubsocialAddress } = await import('@subsocial/utils')
    const parsedAddress = toSubsocialAddress(address)!

    set({ connectedWallet: { address: parsedAddress, signer } })
    get()._subscribeConnectedWalletEnergy()
  },
  saveProxyAddress: () => {
    const { connectedWallet } = get()
    if (!connectedWallet) return
    parentProxyAddressStorage.set(connectedWallet.address)
    set({ parentProxyAddress: connectedWallet.address })
  },
  disconnectProxy: () => {
    get().connectedWallet?._unsubscribeEnergy?.()
    set({ connectedWallet: undefined, parentProxyAddress: undefined })
    parentProxyAddressStorage.remove()
  },
  login: async (secretKey, config) => {
    const { asTemporaryAccount, isInitialization } = config || {}
    const { toSubsocialAddress } = await import('@subsocial/utils')
    const analytics = useAnalytics.getState()
    let address: string = ''
    try {
      if (!secretKey) {
        secretKey = (await generateAccount()).secretKey
        const { parentOrigin } = useParentData.getState()
        analytics.sendEvent(
          'account_created',
          {},
          {
            cameFrom: parentOrigin,
            cohortDate: dayjs().toDate(),
          }
        )
      } else if (secretKey.startsWith('0x')) {
        const augmented = secretKey.substring(2)
        if (isSecretKeyUsingMiniSecret(augmented)) {
          secretKey = augmented
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

      get()._subscribeEnergy()
      if (!asTemporaryAccount) saveLoginInfoToStorage()
    } catch (e) {
      console.error('Failed to login', e)
      return false
    }
    return address
  },
  loginAsTemporaryAccount: () => {
    set({ isTemporaryAccount: true })
    return get().login(undefined, { asTemporaryAccount: true })
  },
  finalizeTemporaryAccount: () => {
    saveLoginInfoToStorage()
    set({ isTemporaryAccount: false })
  },
  _subscribeEnergy: () => {
    const { address, _unsubscribeEnergy } = get()
    _unsubscribeEnergy()

    const unsub = subscribeEnergy(address, (energy) => {
      set({ energy })
    })
    set({ _unsubscribeEnergy: () => unsub.then((unsub) => unsub?.()) })
  },
  logout: () => {
    const { _unsubscribeEnergy, address } = get()
    _unsubscribeEnergy()

    accountStorage.remove()
    accountAddressStorage.remove()
    hasSentMessageStorage.remove()
    parentProxyAddressStorage.remove()
    if (address) followedIdsStorage.remove(address)

    set({ ...initialState })
  },
  init: async () => {
    const { isInitialized, login } = get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    const encodedSecretKey = accountStorage.get()
    const parentProxyAddress = parentProxyAddressStorage.get()

    if (encodedSecretKey) {
      const storageAddress = accountAddressStorage.get()
      set({ address: storageAddress || undefined })

      const secretKey = decodeSecretKey(encodedSecretKey)
      const address = await login(secretKey, { isInitialization: true })

      if (!address) {
        accountStorage.remove()
        accountAddressStorage.remove()
        set({ address: null })
      }

      sendLaunchEvent(address, parentProxyAddress)
    } else {
      sendLaunchEvent()
    }

    set({ isInitialized: true })

    const preferredWallet = preferredWalletStorage.get()
    if (preferredWallet) {
      const wallet = getWallets().find(
        (wallet) => wallet.title === preferredWallet
      )
      if (wallet) set({ preferredWallet: wallet })
      else preferredWalletStorage.remove()
    }

    if (parentProxyAddress) {
      set({ parentProxyAddress })
      try {
        const proxy = await getProxiesQuery.fetchQuery(queryClient, {
          address: parentProxyAddress,
        })
        const isProxyValid = proxy.includes(get().address ?? '')
        if (!isProxyValid) {
          parentProxyAddressStorage.remove()
          set({ parentProxyAddress: undefined })
        }
      } catch (err) {
        console.error('Failed to fetch proxies', err)
      }
    }
  },
}))

async function subscribeEnergy(
  address: string | null,
  onEnergyUpdate: (energy: number) => void,
  isRetrying?: boolean
): Promise<undefined | (() => void)> {
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
    return subscribeEnergy(address, onEnergyUpdate, true)
  }

  const unsub = substrateApi.query.energy.energyBalance(
    address,
    (energyAmount) => {
      let parsedEnergy: unknown = energyAmount
      if (typeof energyAmount.toPrimitive === 'function') {
        parsedEnergy = energyAmount.toPrimitive()
      }
      const energy = parseFloat(parsedEnergy + '')
      console.log('Current energy: ', address, energy)
      onEnergyUpdate(energy)
    }
  )
  return unsub
}

function saveLoginInfoToStorage() {
  const { address, encodedSecretKey, signer } = useMyAccount.getState()
  if (!address || !encodedSecretKey || !signer) return
  accountStorage.set(encodedSecretKey)
  accountAddressStorage.set(address)

  useAnalytics.getState().setUserId(signer.address)
}

export function getMyMainAddress() {
  const { address, parentProxyAddress } = useMyAccount.getState()
  return parentProxyAddress || address
}

export function useMyMainAddress() {
  const address = useMyAccount((state) => state.address)
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  return parentProxyAddress || address
}

export function getHasEnoughEnergy(energy: number | undefined | null) {
  return energy ?? 0 > ESTIMATED_ENERGY_FOR_ONE_TX
}

export async function enableWallet({
  listener,
  onError,
}: {
  listener: (accounts: WalletAccount[]) => void
  onError: (err: unknown) => void
}) {
  const preferredWallet = useMyAccount.getState().preferredWallet
  if (!preferredWallet) return

  try {
    await preferredWallet.enable('grill.chat')
    const unsub = preferredWallet.subscribeAccounts((accounts) => {
      listener(accounts ?? [])
    })
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  } catch (err) {
    onError(err)
  }
}

export async function enableWalletOnce() {
  return new Promise<WalletAccount[]>((resolve, reject) => {
    const unsub = enableWallet({
      listener: (accounts) => {
        unsub.then((unsub) => unsub?.())
        resolve(accounts)
      },
      onError: (err) => {
        reject(err)
      },
    })
  })
}

type PromiseOrValue<T> = Promise<T> | T
export type WalletSigner = {
  signRaw: (payload: {
    address: string
    data: string
  }) => PromiseOrValue<string>
}
export function useGetCurrentSigner(): () => Promise<WalletSigner | undefined> {
  const address = useMyAccount((state) => state.address)
  const signer = useMyAccount((state) => state.signer)
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)

  return async () => {
    try {
      if (!address || !parentProxyAddress)
        throw new Error('You need to login first')
      if (!parentProxyAddress) {
        if (!signer) throw new Error('No signer connected')

        return {
          signRaw: ({ address, data }) => {
            if (
              toSubsocialAddress(signer.address) !== toSubsocialAddress(address)
            )
              throw new Error('Invalid address')

            return signer.sign(data).toString()
          },
        }
      }

      const { web3Enable, web3FromAddress } = await import(
        '@polkadot/extension-dapp'
      )
      const extensions = await web3Enable('grill.chat')

      if (extensions.length === 0) {
        return
      }
      const extSigner = (await web3FromAddress(parentProxyAddress)).signer

      if (!extSigner)
        throw new Error(
          'Signer not found, please relogin your account to continue'
        )
      return {
        signRaw: async ({ address, data }) => {
          const sig = await extSigner!.signRaw?.({
            address,
            data,
            type: 'bytes',
          })
          return sig?.signature.toString() ?? ''
        },
      }
    } catch (err) {
      return undefined
    }
  }
}
