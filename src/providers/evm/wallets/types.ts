import { Chain } from 'wagmi'

export interface WalletOptions {
  chains: Chain[]
  shimDisconnect?: boolean
}
