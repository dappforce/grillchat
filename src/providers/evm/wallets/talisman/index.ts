import { TalismanConnector } from '@talismn/wagmi-connector'
import { WalletOptions } from '../types'

export const talismanWallet = ({ chains, shimDisconnect }: WalletOptions) => ({
  id: 'talisman',
  name: 'Talisman',
  iconUrl: '/talisman.png',
  iconBackground: '#D5FF5C',
  downloadUrls: {
    browserExtension: 'https://talisman.xyz/download',
  },
  createConnector: () => {
    const connector = new TalismanConnector({
      chains: chains as any,
      options: {
        shimDisconnect,
      },
    })

    return {
      connector: connector as any,
    }
  },
})
