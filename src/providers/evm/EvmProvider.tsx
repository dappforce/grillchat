import useGetTheme from '@/hooks/useGetTheme'
import { isTouchDevice } from '@/utils/device'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, WagmiConfig } from 'wagmi'
import { getConfiguredChains } from '../utils'
import { talismanWallet } from './wallets/talisman'

const { chains, publicClient, webSocketPublicClient } = getConfiguredChains()

const commonWallets = [metaMaskWallet({ chains })]

const desktopWallets = [
  ...commonWallets,
  talismanWallet({ chains }),
  argentWallet({ chains }),
  coinbaseWallet({ chains, appName: '' }),
  ledgerWallet({ chains }),
]

const mobileWallets = [...commonWallets]

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: isTouchDevice() ? mobileWallets : desktopWallets,
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
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

const getRainbowkitThemes = () => {
  const darkThemeParams = darkTheme()
  const lightThemeParams = lightTheme()

  return {
    dark: {
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
      ...radiiConfig,
    },
    light: {
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
      ...radiiConfig,
    },
  }
}

type EvmProviderProps = {
  children: React.ReactNode
}

const EvmProvider = ({ children }: EvmProviderProps) => {
  const appTheme = useGetTheme()

  const rainbowkitThemes = getRainbowkitThemes()

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={rainbowkitThemes[appTheme || 'dark']}
        chains={chains}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default EvmProvider
