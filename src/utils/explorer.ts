import { SUBSTRATE_URL } from '@/constants/subsocial'

export function getExplorerUrl(blockHash: string | number) {
  return `https://polkadot.js.org/apps/?rpc=${SUBSTRATE_URL}#/explorer/query/${blockHash}`
}
