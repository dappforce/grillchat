import { Chain, Wallet } from '@rainbow-me/rainbowkit'
import { TalismanConnector } from '@talismn/wagmi-connector'

export interface MyWalletOptions {
  chains: Chain[]
  shimDisconnect?: boolean
}

export const talismanWallet = ({ chains, shimDisconnect }: MyWalletOptions): Wallet => ({
  id: 'talisman',
  name: 'Talisman',
  iconUrl: '/talisman.png',
  iconBackground: '#D5FF5C',
  downloadUrls: {
    browserExtension: 'https://talisman.xyz/download'
  },
  createConnector: () => {
    const connector = new TalismanConnector({
      chains: chains as any, // they are compatible
      options: {
        shimDisconnect
      }
    })

    return {
      connector: connector as any // they are compatible
    }
  }
})