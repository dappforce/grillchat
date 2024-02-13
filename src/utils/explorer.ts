import { env } from '@/env.mjs'

export function getExplorerUrl(blockHash: string | number) {
  return `https://polkadot.js.org/apps/?rpc=${env.NEXT_PUBLIC_SUBSTRATE_WSS}#/explorer/query/${blockHash}`
}
