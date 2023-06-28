import { configureChains } from 'wagmi'
import { mainnet, moonbeam, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const getConfiguredChains = () =>
  configureChains([polygon, moonbeam, mainnet], [publicProvider()])
