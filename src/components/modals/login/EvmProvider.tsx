import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet({ chains })],
  },
])

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
})

type EvmProviderProps = {
  children: React.ReactNode
}

const EvmProvider = ({ children }: EvmProviderProps) => {
  const darkThemeParams = darkTheme()

  const theme = {
    blurs: {
      ...darkThemeParams.blurs,
    },
    colors: {
      ...darkThemeParams.colors,
      accentColor: '#EB2F96',
    },
    fonts: {
      ...darkThemeParams.fonts,
    },
    radii: {
      actionButton: '10px',
      connectButton: '10px',
      menuButton: '10px',
      modal: '10px',
      modalMobile: '10px',
    },
    shadows: {
      ...darkThemeParams.shadows,
    },
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={theme} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default EvmProvider
