import { walletConnectProjectId } from '@/constants/evm'
import useGetTheme from '@/hooks/useGetTheme'
import { isTouchDevice } from '@/utils/device'
import { SafeLocalStorage } from '@/utils/storage'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, createStorage, WagmiConfig } from 'wagmi'
import { getConfiguredChains } from '../utils'
import { subWalletWallet } from './wallets/subwallet'
import { talismanWallet } from './wallets/talisman'

const { chains, publicClient, webSocketPublicClient } = getConfiguredChains()
const walletOptions = {
  chains,
  projectId: walletConnectProjectId,
  appName: 'Grill',
}
const commonWallets = [metaMaskWallet(walletOptions)]

const desktopWallets = [
  ...commonWallets,
  talismanWallet(walletOptions),
  argentWallet(walletOptions),
  coinbaseWallet(walletOptions),
  ledgerWallet(walletOptions),
  subWalletWallet(walletOptions),
]

const mobileWallets = [
  walletConnectWallet(walletOptions),
  injectedWallet(walletOptions),
]

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
  storage: createStorage({ storage: SafeLocalStorage }),
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
