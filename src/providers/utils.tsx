import { walletConnectProjectId } from '@/constants/evm'
import { w3mProvider } from '@web3modal/ethereum'
import { configureChains } from 'wagmi'
import { mainnet, moonbeam, polygon } from 'wagmi/chains'

export const getConfiguredChains = () =>
  configureChains(
    [polygon, moonbeam, mainnet],
    [w3mProvider({ projectId: walletConnectProjectId })]
  )
