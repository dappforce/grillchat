import useGetTheme from '@/hooks/useGetTheme'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
  Theme
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

const accentColor = '#4D46DC'

const radiiConfig = {
  radii: {
    actionButton: '24px',
    connectButton: '10px',
    menuButton: '10px',
    modal: '20px',
    modalMobile: '20px',
  },
}

type EvmProviderProps = {
  children: React.ReactNode
}

const EvmProvider = ({ children }: EvmProviderProps) => {
  const appTheme = useGetTheme()

  const darkThemeParams = darkTheme()
  const lightThemeParams = lightTheme()



  const theme: Theme = {
    darkMode: {
      blurs: {
        ...darkThemeParams.blurs,
      },
      colors: {
        ...darkThemeParams.colors,
        accentColor,
        modalBackground: '#111729',
        modalBorder: '#111729',
      },
      fonts: {
        ...darkThemeParams.fonts,
      },
      shadows: {
        ...darkThemeParams.shadows,
      },
      ...radiiConfig
    },
    lightMode: {
      blurs: {
        ...lightThemeParams.blurs,
      },
      colors: {
        ...lightThemeParams.colors,
        accentColor,
        modalBackground: '#E5E5E5',
        modalBorder: '#E5E5E5',
      },
      fonts: {
        ...lightThemeParams.fonts,
      },
      shadows: {
        ...lightThemeParams.shadows,
      },
      ...radiiConfig
    },
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={appTheme === 'dark' ? theme.darkMode : theme.lightMode} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default EvmProvider
