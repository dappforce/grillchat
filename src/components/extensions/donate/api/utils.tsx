import { talismanWallet } from '@/providers/evm/wallets/talisman'
import { getConfiguredChains } from '@/providers/utils'
import { LocalStorage } from '@/utils/storage'
import {
  InstructionStepName,
  Wallet,
} from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { Chain, Connector } from 'wagmi'

const WAGMI_WALLET = 'wagmi.wallet'

const walletStorage = new LocalStorage(() => WAGMI_WALLET)

export const getWalletFromStorage = () =>
  walletStorage.get()?.replace(/[^a-zA-Z ]/g, '')

export type RainbowKitConnector<C extends Connector = Connector> = {
  connector: C
  mobile?: {
    getUri?: () => Promise<string>
  }
  desktop?: {
    getUri?: () => Promise<string>
  }
  qrCode?: {
    getUri: () => Promise<string>
    instructions?: {
      learnMoreUrl: string
      steps: {
        step: InstructionStepName
        title: string
        description: string
      }[]
    }
  }
  extension?: {
    instructions?: {
      learnMoreUrl: string
      steps: {
        step: InstructionStepName
        title: string
        description: string
      }[]
    }
  }
}

const getWallet = (chains: Chain[]) => {
  const supportedWallets: Record<string, Wallet> = {
    metamask: metaMaskWallet({ chains }),
    talisman: talismanWallet({ chains }),
    argent: argentWallet({ chains }),
    coinbase: coinbaseWallet({ chains, appName: '' }),
    ledger: ledgerWallet({ chains }),
    // subwallet: subWalletWallet({ chains }),
  }

  const currentWalletId = getWalletFromStorage()

  const wallet = currentWalletId
    ? supportedWallets[currentWalletId]
    : metaMaskWallet({ chains })

  return wallet ? wallet : metaMaskWallet({ chains })
}

export const getConnector = () => {
  const { chains } = getConfiguredChains()

  const wallet = getWallet(chains)

  return wallet.createConnector()
}

type OpenWalletProps = {
  connector: RainbowKitConnector<Connector<any, any>>
}

export const openMobileWallet = async ({ connector }: OpenWalletProps) => {
  const getUri = connector.mobile?.getUri
  if (getUri) {
    const mobileUri = await getUri()
    if (mobileUri.startsWith('http')) {
      const link = document.createElement('a')
      link.href = mobileUri
      link.target = '_blank'
      link.rel = 'noreferrer noopener'
      link.click()
    } else {
      window.location.href = mobileUri
    }
  }
}

export const tryParseDecimals = (decimals?: any) =>
  decimals ? parseInt(decimals.toString()) : undefined
