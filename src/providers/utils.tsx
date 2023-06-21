import { configureChains } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const getConfiguredChains = () =>
  configureChains([polygon, mainnet], [publicProvider()])
