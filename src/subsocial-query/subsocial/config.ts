import type { SubsocialApi } from '@subsocial/api'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  ipfsNodeUrl: string
  postConnectConfig?: (api: SubsocialApi) => void
}

const DEFAULT_STAGING_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
  postConnectConfig: (api) => {
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + CRUST_TEST_AUTH_KEY,
    })
  },
}
const DEFAULT_PROD_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://para.f3joule.space',
  ipfsNodeUrl: 'https://gw.crustfiles.app',
  postConnectConfig: (api) => {
    api.ipfs.setWriteHeaders({
      authorization: 'Basic ' + CRUST_TEST_AUTH_KEY,
    })
  },
}

export const CRUST_TEST_AUTH_KEY =
  'c3ViLTVGQTluUURWZzI2N0RFZDhtMVp5cFhMQm52TjdTRnhZd1Y3bmRxU1lHaU45VFRwdToweDEwMmQ3ZmJhYWQwZGUwNzFjNDFmM2NjYzQzYmQ0NzIxNzFkZGFiYWM0MzEzZTc5YTY3ZWExOWM0OWFlNjgyZjY0YWUxMmRlY2YyNzhjNTEwZGY4YzZjZTZhYzdlZTEwNzY2N2YzYTBjZjM5OGUxN2VhMzAyMmRkNmEyYjc1OTBi' // can only be used for testnet.

const presets = {
  staging: DEFAULT_STAGING_CONFIG,
  prod: DEFAULT_PROD_CONFIG,
}
const DEFAULT_CONFIG_PRESET: keyof typeof presets = 'staging'

let config: SubsocialConnectionConfig = presets[DEFAULT_CONFIG_PRESET]
export function getConnectionConfig() {
  return config
}
export const setSubsocialConfig = (
  preset: keyof typeof presets,
  customConfig?: Partial<SubsocialConnectionConfig>
) => {
  config = { ...presets[preset], ...customConfig }
}

export interface TxCallbacksParams {
  summary: string
  address: string
  params: any
  explorerLink?: string
  error?: string
}
const DEFAULT_TX_CALLBACKS = {
  onBroadcast: ({ summary }: TxCallbacksParams) =>
    console.info(`Broadcasting ${summary}...`),
  onError: ({ error }: TxCallbacksParams) => console.error(error),
  onSuccess: ({ summary }: TxCallbacksParams) =>
    console.log(`Success submit ${summary}...`),
}
let globalTxCallbacks = DEFAULT_TX_CALLBACKS
export const setupTxCallbacks = (
  callbacks: Partial<typeof globalTxCallbacks>
) => {
  globalTxCallbacks = { ...DEFAULT_TX_CALLBACKS, ...callbacks }
}
export const getGlobalTxCallbacks = () => globalTxCallbacks
