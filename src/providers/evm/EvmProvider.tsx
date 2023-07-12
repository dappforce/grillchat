import { walletConnectProjectId } from '@/constants/evm'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import dynamic from 'next/dynamic'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, moonbeam, polygon } from 'wagmi/chains'

const chains = [polygon, moonbeam, mainnet]

const Web3ModalPortal = dynamic(import('./Web3ModalPortal'), { ssr: false })

const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId: walletConnectProjectId }),
])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId: walletConnectProjectId, chains }),
  publicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

type EvmProviderProps = {
  children: React.ReactNode
}

const EvmProvider = ({ children }: EvmProviderProps) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        {children}
        <Web3ModalPortal ethereumClient={ethereumClient} />
      </WagmiConfig>
    </>
  )
}

export default EvmProvider
