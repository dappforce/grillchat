import type { SubsocialApi } from '@subsocial/api'
import { getSubsocialApi } from './connection'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  ipfsNodeUrl: string
  ipfsAdminNodeUrl?: string
  postConnectConfig?: (api: SubsocialApi) => void
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
  return getSubsocialApi
}

export interface TxCallbackInfo {
  summary: string
  address: string
  data: unknown
  explorerLink?: string
  error?: unknown
}
const DEFAULT_TX_CALLBACKS = {
  onBroadcast: ({ summary }: TxCallbackInfo) =>
    console.info(`Broadcasting ${summary}...`),
  onError: ({ error }: TxCallbackInfo) =>
    console.error(
      'Tx Error',
      typeof error === 'string' ? error : (error as Error)?.message
    ),
  onSuccess: ({ summary }: TxCallbackInfo) =>
    console.log(`Success submit ${summary}...`),
}
let globalTxCallbacks = DEFAULT_TX_CALLBACKS
export const setupTxCallbacks = (
  callbacks: Partial<typeof globalTxCallbacks>
) => {
  globalTxCallbacks = { ...DEFAULT_TX_CALLBACKS, ...callbacks }
}
export const getGlobalTxCallbacks = () => globalTxCallbacks
