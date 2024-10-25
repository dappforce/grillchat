import { env } from '@/env.mjs'
import type { SubsocialApi } from '@subsocial/api'

export interface SubsocialConnectionConfig {
  substrateUrl: string
  substrateHttpUrl: string
  ipfsNodeUrl: string
  ipfsAdminNodeUrl?: string
  postConnectConfig?: (api: SubsocialApi) => void
}

// TODO: research better way to have this config set outside of this subsocial-query folder
let config: SubsocialConnectionConfig = {
  substrateUrl: env.NEXT_PUBLIC_SUBSTRATE_WSS,
  substrateHttpUrl: env.NEXT_PUBLIC_SUBSTRATE_URL,
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
  explorerLink?: string
  error?: unknown
}
const DEFAULT_TX_CALLBACKS = {
  onSend: ({ summary }: TxCallbackInfo) =>
    console.info(`Sending ${summary}...`),
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
