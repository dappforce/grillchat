import { getSubstrateUrl } from './env/client'

export function getExplorerUrl(blockHash: string | number) {
  return `https://polkadot.js.org/apps/?rpc=${
    getSubstrateUrl().wss
  }#/explorer/query/${blockHash}`
}
