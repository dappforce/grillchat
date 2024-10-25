export function getBlockExplorerBlockInfoLink(rpc: string, blockHash: string) {
  return `https://polkadot.js.org/apps/?${rpc}#/explorer/query/${blockHash}`
}
