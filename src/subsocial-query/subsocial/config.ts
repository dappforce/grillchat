import type { SubsocialApi } from '@subsocial/api'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  ipfsNodeUrl: string
  postConnectConfig?: (api: SubsocialApi) => void
}

export const CRUST_IPFS_CONFIG = {
  ipfsNodeUrl: 'https://gw-seattle.cloud3.cc',
  ipfsClusterUrl: 'https://test-pin.cloud3.cc/psa',
}

const DEFAULT_STAGING_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://rco-para.subsocial.network',
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
}
const DEFAULT_PROD_CONFIG: SubsocialConnectionConfig = {
  substrateUrl: 'wss://para.f3joule.space',
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
}

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
  error?: unknown
}
const DEFAULT_TX_CALLBACKS = {
  onBroadcast: ({ summary }: TxCallbacksParams) =>
    console.info(`Broadcasting ${summary}...`),
  onError: ({ error }: TxCallbacksParams) =>
    console.error('Tx Error', (error as Error).message),
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
