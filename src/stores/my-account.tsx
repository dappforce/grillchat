import Toast from '@/components/Toast'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { sendEventWithRef } from '@/components/referral/analytics'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { linkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getReferrerIdQuery } from '@/services/datahub/referral/query'
import { queryClient } from '@/services/provider'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { getOwnedPostIdsQuery } from '@/services/subsocial/posts'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useParentData } from '@/stores/parent'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  Signer,
  decodeSecretKey,
  encodeSecretKey,
  generateAccount,
  isSecretKeyUsingMiniSecret,
  loginWithSecretKey,
  validateAddress,
} from '@/utils/account'
import { waitNewBlock } from '@/utils/blockchain'
import { currentNetwork } from '@/utils/network'
import { wait } from '@/utils/promise'
import { LocalStorage, LocalStorageAndForage } from '@/utils/storage'
import { isWebNotificationsEnabled } from '@/utils/window'
import { toSubsocialAddress } from '@subsocial/utils'
import { Wallet, WalletAccount, getWallets } from '@talismn/connect-wallets'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { UserProperties, useAnalytics } from './analytics'
import { create, createSelectors } from './utils'

type State = {
  isInitialized: boolean | undefined
  isInitializedAddress: boolean | undefined
  isInitializedProxy: boolean | undefined
  isTemporaryAccount: boolean

  preferredWallet: Wallet | null
  connectedWallet:
    | {
        address: string
        signer: Signer | null
        energy?: number
        _unsubscribeEnergy?: () => void
      }
    | undefined
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
  _readPreferredWalletFromStorage: () => Wallet | undefined
}

const initialState: State = {
  connectedWallet: undefined,
  isInitialized: undefined,
  isInitializedAddress: true,
  isInitializedProxy: false,
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
const temporaryAccountStorage = new LocalStorage(() => 'temp-account')
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
    sendEvent('app_launched', undefined, { ref: getReferralIdInUrl() })
  } else {
    const [
      // linkedTgAccData,
      evmLinkedAddress,
      ownedPostIds,
      linkedIdentity,
      referrerId,
    ] = await Promise.allSettled([
      // getLinkedTelegramAccountsQuery.fetchQuery(queryClient, {
      //   address,
      // }),
      getAccountDataQuery.fetchQuery(queryClient, address),
      getOwnedPostIdsQuery.fetchQuery(queryClient, address),
      getLinkedIdentityQuery.fetchQuery(queryClient, address),
      getReferrerIdQuery.fetchQuery(queryClient, address),
    ] as const)

    // if (linkedTgAccData.status === 'fulfilled')
    //   userProperties.tgNotifsConnected =
    //     (linkedTgAccData.value?.length || 0) > 0
    if (evmLinkedAddress.status === 'fulfilled')
      userProperties.evmLinked = !!evmLinkedAddress.value
    if (ownedPostIds.status === 'fulfilled')
      userProperties.ownedChat = (ownedPostIds.value?.length || 0) > 0
    if (linkedIdentity.status === 'fulfilled')
      userProperties.twitterLinked =
        linkedIdentity.value?.provider === IdentityProvider.Twitter
    if (referrerId.status === 'fulfilled')
      userProperties.ref = referrerId.value || getReferralIdInUrl()

    userProperties.webNotifsEnabled = isWebNotificationsEnabled()

    sendEvent('app_launched', undefined, userProperties)
  }
}

const useMyAccountBase = create<State & Actions>()((set, get) => ({
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
        sendEventWithRef(address, (refId) => {
          analytics.sendEvent(
            'account_created',
            {},
            {
              cameFrom: parentOrigin,
              cohortDate: dayjs().toDate(),
              ref: refId,
            }
          )
        })
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
      if (asTemporaryAccount) {
        temporaryAccountStorage.set(encodedSecretKey)
      } else saveLoginInfoToStorage()

      if (!isInitialization) {
        console.log('getting')
        const parentProxyAddress = await getParentProxyAddress(address)
        console.log('gettingsdf', parentProxyAddress)
        if (parentProxyAddress) {
          parentProxyAddressStorage.set(parentProxyAddress)
          set({ parentProxyAddress })
          await validateParentProxyAddress({
            grillAddress: address,
            parentProxyAddress,
            signer,
            onAnyProxyRemoved: () => {
              get().logout()
              toast.custom((t) => (
                <Toast
                  t={t}
                  type='error'
                  title='Login failed'
                  subtitle='Sorry we had to remove your proxy, please relogin to use your account again.'
                />
              ))
            },
            onInvalidProxy: () => {
              get().logout()
              toast.custom((t) => (
                <Toast
                  t={t}
                  type='error'
                  title='Login failed'
                  subtitle='You seem to have logged in to your wallet in another device, please relogin using "Connect via Polkadot" to use it here'
                />
              ))
            },
          })
        }
      }
    } catch (e) {
      console.error('Failed to login', e)
      if (!isInitialization) {
        toast.custom((t) => (
          <Toast
            t={t}
            type='error'
            title='Login Failed'
            description='The Grill key you provided is not valid'
          />
        ))
      }
      return false
    }
    return get().address || false
  },
  loginAsTemporaryAccount: async () => {
    set({ isTemporaryAccount: true })
    const encodedTempAcc = temporaryAccountStorage.get()
    let tempAcc = undefined
    if (encodedTempAcc) tempAcc = decodeSecretKey(encodedTempAcc)

    const res = await get().login(tempAcc, {
      asTemporaryAccount: true,
    })
    if (!res) temporaryAccountStorage.remove()

    return res
  },
  finalizeTemporaryAccount: () => {
    saveLoginInfoToStorage()
    temporaryAccountStorage.remove()
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

    set({ ...initialState, isInitialized: true, isInitializedProxy: true })
  },
  _readPreferredWalletFromStorage: () => {
    const preferredWallet = preferredWalletStorage.get()
    let wallet: Wallet | undefined
    if (preferredWallet) {
      wallet = getWallets().find((wallet) => wallet.title === preferredWallet)
      if (wallet) set({ preferredWallet: wallet })
      else preferredWalletStorage.remove()
    }
    return wallet
  },
  init: async () => {
    const { isInitialized, login, _readPreferredWalletFromStorage } = get()

    // Prevent multiple initialization
    if (isInitialized !== undefined) return
    set({ isInitialized: false })

    _readPreferredWalletFromStorage()

    const encodedSecretKey = accountStorage.get()
    const parentProxyAddressFromStorage = parentProxyAddressStorage.get()

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

      sendLaunchEvent(address, parentProxyAddressFromStorage)
    } else {
      sendLaunchEvent()
    }

    set({ isInitialized: true })

    const address = get().address
    const parentProxyAddress =
      parentProxyAddressFromStorage ||
      (address ? await getParentProxyAddress(address) : undefined)

    if (parentProxyAddress) {
      set({ parentProxyAddress })
      await validateParentProxyAddress({
        grillAddress: get().address!,
        parentProxyAddress,
        signer: get().signer!,
        onAnyProxyRemoved: () => {
          get().logout()
          toast.custom((t) => (
            <Toast
              t={t}
              type='error'
              title='Logged out'
              subtitle='Sorry we had to remove your proxy, please relogin to use your account again.'
            />
          ))
        },
        onInvalidProxy: () => {
          get().logout()
          toast.custom((t) => (
            <Toast
              t={t}
              type='error'
              title='Logged out'
              subtitle='You seem to have logged in to your wallet in another device, please relogin to use it here'
            />
          ))
        },
      })
    }
    set({ isInitializedProxy: true })

    // if we use parentProxy from storage, then need to check whether the account is linked in datahub or not, and link if not yet
    // this is a background process, so it needs to be done after all other init is done
    const finalAddress = get().address
    const finalParentProxyAddress = get().parentProxyAddress
    if (finalAddress && finalParentProxyAddress) {
      linkPolkadotIfNotLinked(finalAddress, finalParentProxyAddress)
    }
  },
}))
export const useMyAccount = createSelectors(useMyAccountBase)

async function linkPolkadotIfNotLinked(
  address: string,
  parentProxyAddress: string
) {
  const linkedAddress = await getParentProxyAddress(address)
  if (
    toSubsocialAddress(linkedAddress ?? '')! ===
    toSubsocialAddress(parentProxyAddress)!
  )
    return

  try {
    await linkIdentity({
      address,
      args: {
        id: parentProxyAddress,
        // @ts-expect-error because using IdentityProvider from generated types, but its same with the datahub sdk
        provider: IdentityProvider.Polkadot,
      },
    })
    getLinkedIdentityQuery.invalidate(queryClient, address)
  } catch (err) {
    console.error('Failed to link polkadot identity', err)
  }
}

async function validateParentProxyAddress({
  grillAddress,
  parentProxyAddress,
  signer,
  onAnyProxyRemoved,
  onInvalidProxy,
}: {
  parentProxyAddress: string
  grillAddress: string
  signer: Signer
  onInvalidProxy: () => void
  onAnyProxyRemoved: () => void
}) {
  try {
    // Remove proxy with type 'Any'
    const proxies = await getProxiesQuery.fetchQuery(queryClient, {
      address: parentProxyAddress,
    })
    const currentProxy = proxies.find(({ address }) => address === grillAddress)
    if (currentProxy?.proxyType === 'Any') {
      async function removeProxy() {
        const api = await getSubsocialApi()
        const substrateApi = await api.substrateApi
        await substrateApi.tx.proxy
          .proxy(
            parentProxyAddress!,
            null,
            substrateApi.tx.proxy.removeProxies()
          )
          .signAndSend(signer)
      }
      removeProxy()

      onAnyProxyRemoved()
    } else if (!currentProxy) {
      onInvalidProxy()
    }
  } catch (err) {
    console.error('Failed to fetch proxies', err)
  }
}

async function getParentProxyAddress(grillAddress: string) {
  try {
    const linkedIdentity = await getLinkedIdentityQuery.fetchQuery(
      queryClient,
      grillAddress
    )
    if (linkedIdentity?.provider === IdentityProvider.Polkadot) {
      const isValid = await validateAddress(linkedIdentity.substrateAccount)
      if (!isValid) return null

      return linkedIdentity.externalId
    }
    return null
  } catch (err) {
    console.error('Failed to get linked identity')
    return null
  }
}

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

  let prev: null | number = null
  const unsub = substrateApi.query.energy.energyBalance(
    address,
    async (energyAmount) => {
      let parsedEnergy: unknown = energyAmount
      if (typeof energyAmount.toPrimitive === 'function') {
        parsedEnergy = energyAmount.toPrimitive()
      }

      const energy = parseFloat(parsedEnergy + '')
      if (
        prev !== null &&
        prev < ESTIMATED_ENERGY_FOR_ONE_TX &&
        currentNetwork === 'subsocial'
      )
        await waitNewBlock()

      prev = energy

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
  return (energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
}

export async function enableWallet({
  listener,
  onError,
}: {
  listener: (accounts: WalletAccount[]) => void
  onError: (err: unknown) => void
}) {
  let preferredWallet = useMyAccount.getState().preferredWallet
  if (!preferredWallet) {
    const fromStorage = useMyAccount
      .getState()
      ._readPreferredWalletFromStorage()
    if (fromStorage) {
      preferredWallet = fromStorage
    } else {
      const firstInstalledWallet = getWallets().find(
        (wallet) => wallet.installed
      )
      if (!firstInstalledWallet)
        return onError(new Error('No supported wallet found'))
      preferredWallet = firstInstalledWallet
    }
  }

  try {
    await preferredWallet.enable('grillapp')
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
      const extensions = await web3Enable('grillapp')

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

export function getIsLoggedIn() {
  return !!accountStorage.get()
}
