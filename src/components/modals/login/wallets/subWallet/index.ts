import { Chain, Wallet } from '@rainbow-me/rainbowkit'
import { SubWalletConnector } from '@subwallet/wagmi-connector'

export interface MyWalletOptions {
  chains: Chain[]
  shimDisconnect?: boolean
}

export const subWalletWallet = ({ chains, shimDisconnect }: MyWalletOptions): Wallet => ({
  id: 'subwallet',
  name: 'SubWallet',
  iconUrl: '/subwallet.svg',
  iconBackground: '#fff',
  downloadUrls: {
    browserExtension: 'https://subwallet.app/download.html'
  },
  createConnector: () => {
    const connector = new SubWalletConnector({
      chains: chains as any,
      options: {
        shimDisconnect
      }
    })

    return {
      connector: connector as any
    }
  }
})