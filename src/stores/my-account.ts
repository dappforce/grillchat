import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { queryClient } from '@/services/provider'
import { getAccountsData } from '@/services/subsocial/evmAddresses'
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
import { getWallets, Wallet } from '@talismn/connect-wallets'
import dayjs from 'dayjs'
import { useAnalytics } from './analytics'
import { create } from './utils'

type State = {
  isInitialized?: boolean
  isInitializedAddress?: boolean

  preferredWallet: Wallet | null
  connectedWallet?: {
    address: string
    signer: Signer | null
    energy?: number
    _unsubscribeEnergy?: () => void
  }
  parentProxyAddress?: string

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
  setPreferredWallet: (wallet: Wallet | null) => void
  connectWallet: (address: string, signer: Signer | null) => Promise<void>
  saveProxyAddress: () => void
  disconnectWallet: () => void
  _subscribeEnergy: () => void
  _subscribeConnectedWalletEnergy: () => void
}

const initialState: State = {
  isInitializedAddress: true,
  preferredWallet: null,
  address: null,
  signer: null,
  energy: null,
  encodedSecretKey: null,
  _unsubscribeEnergy: () => undefined,
}

const ACCOUNT_ADDRESS_STORAGE_KEY = 'accountPublicKey'
const ACCOUNT_STORAGE_KEY = 'account'
const FOLLOWED_IDS_STORAGE_KEY = 'followedPostIds'
const CONNECTED_WALLET_ADDRESS_STORAGE_KEY = 'connectedWalletAddress'

export const accountAddressStorage = new LocalStorageAndForage(
  () => ACCOUNT_ADDRESS_STORAGE_KEY
)
export const followedIdsStorage = new LocalStorageAndForage(
  (address: string) => `${FOLLOWED_IDS_STORAGE_KEY}:${address}`
)
export const hasSentMessageStorage = new LocalStorage(() => 'has-sent-message')
const accountStorage = new LocalStorage(() => ACCOUNT_STORAGE_KEY)
const parentProxyAddressStorage = new LocalStorage(
  () => CONNECTED_WALLET_ADDRESS_STORAGE_KEY
)
const preferredWalletStorage = new LocalStorage(() => 'preferred-wallet')

const sendLaunchEvent = async (address?: string | false) => {
  let userProperties = {
    tgNotifsConnected: false,
    evmLinked: false,
    webNotifsEnabled: false,
    ownedChat: false,
  }

  const sendEvent = useAnalytics.getState().sendEvent

  if (!address) {
    sendEvent('launch_app')
  } else {
    try {
      const linkedTgAccData = await getLinkedTelegramAccountsQuery.fetchQuery(
        queryClient,
        {
          address,
        }
      )
      userProperties.tgNotifsConnected = (linkedTgAccData?.length || 0) > 0
    } catch {}

    try {
      const [evmLinkedAddress] = await getAccountsData([address])
      userProperties.evmLinked = !!evmLinkedAddress
    } catch {}

    try {
      const ownedPostIds = await getOwnedPostIdsQuery.fetchQuery(
        queryClient,
        address
      )
      userProperties.ownedChat = (ownedPostIds?.length || 0) > 0
    } catch {}

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
  disconnectWallet: () => {
    get().connectedWallet?._unsubscribeEnergy?.()
    set({ connectedWallet: undefined })
    parentProxyAddressStorage.remove()
  },
  login: async (secretKey, isInitialization) => {
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

      accountStorage.set(encodedSecretKey)
      accountAddressStorage.set(address)
      get()._subscribeEnergy()

      analytics.setUserId(signer.address)
    } catch (e) {
      console.log('Failed to login', e)
      return false
    }
    return address
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

      sendLaunchEvent(address)
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

    const parentProxyAddress = parentProxyAddressStorage.get()
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

export function useMyMainAddress() {
  const address = useMyAccount((state) => state.address)
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  return parentProxyAddress || address
}
