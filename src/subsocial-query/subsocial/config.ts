import { SUBSTRATE_URL } from '@/constants/subsocial'
import type { SubsocialApi } from '@subsocial/api'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  ipfsNodeUrl: string
  ipfsAdminNodeUrl?: string
  postConnectConfig?: (api: SubsocialApi) => void
}

// TODO: research better way to have this config set outside of this subsocial-query folder
let config: SubsocialConnectionConfig = {
  substrateUrl: SUBSTRATE_URL,
  ipfsNodeUrl: 'https://ipfs.subsocial.network',
  ipfsAdminNodeUrl: 'https://gw.crustfiles.app',
}
export function getConnectionConfig() {
  return config
}

export interface TxCallbackInfo {
  summary: string
  address: string
  data: unknown
  error?: unknown
}
const DEFAULT_TX_CALLBACKS = {
  onBeforeSend: ({ summary }: TxCallbackInfo) =>
    console.info(`Before sending ${summary}...`),
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
