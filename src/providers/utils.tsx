import { configureChains } from 'wagmi'
import { avalanche, base, bsc, mainnet, moonbeam, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const getConfiguredChains = () =>
  configureChains(
    [polygon, moonbeam, mainnet, base, avalanche, bsc],
    [publicProvider()]
  )
