import { InstructionStepName } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { Chain, Connector } from 'wagmi'

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

type OpenWalletProps = {
  chains: Chain[]
  connector: RainbowKitConnector<Connector<any, any>>
}

export const getConnector = ({ chains }: Pick<OpenWalletProps, 'chains'>) => {
  return metaMaskWallet({ chains }).createConnector()
}

export const openMobileWallet = async ({
  connector,
}: Pick<OpenWalletProps, 'connector'>) => {
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
