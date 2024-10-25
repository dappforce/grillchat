export type StakingConsts = {
  minDelegatorStk: string
  minDelegaton: string
  maxDelegationsPerDelegator: number
}

export type RelayChain = 'polkadot' | 'kusama'

export type ChainInfo = {
  /** Chain name. */
  id: string
  nativeToken: string
  totalIssuance: string
  ss58Format: number
  tokenDecimals: number[]
  tokenSymbols: string[]
  icon: string
  assetsRegistry: Record<string, any>
  name: string
  node: string
  wsNode?: string
  paraId: string
  existentialDeposit: string
  relayChain?: RelayChain
  connected?: boolean
  staking: StakingConsts
  vestingMethod?: string
  isEthLike?: boolean
  isTransferable?: boolean
  tokenTransferMethod?: string
}
