import { walletConnectProjectId } from '@/constants/evm'
import { subWalletWallet } from '@/providers/evm/wallets/subwallet'
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
  walletConnectWallet,
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
  const walletOptions = {
    chains,
    projectId: walletConnectProjectId,
    appName: 'Grill.chat',
  }
  const supportedWallets: Record<string, Wallet> = {
    metamask: metaMaskWallet(walletOptions),
    talisman: talismanWallet(walletOptions),
    argent: argentWallet(walletOptions),
    coinbase: coinbaseWallet(walletOptions),
    ledger: ledgerWallet(walletOptions),
    walletConnect: walletConnectWallet(walletOptions),
    subwallet: subWalletWallet(walletOptions),
  }

  const currentWalletId = getWalletFromStorage()

  const wallet = currentWalletId
    ? supportedWallets[currentWalletId]
    : metaMaskWallet(walletOptions)

  return wallet
}

export const getConnector = () => {
  const { chains } = getConfiguredChains()

  const wallet = getWallet(chains)

  return wallet?.createConnector()
}

type OpenWalletProps = {
  connector: RainbowKitConnector<Connector<any, any>>
}

export const openMobileWallet = async ({ connector }: OpenWalletProps) => {
  const getUri = connector.mobile?.getUri
  if (getUri) {
    const mobileUri = await getUri()

    if (mobileUri && mobileUri.startsWith('http')) {
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
