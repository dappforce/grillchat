import { walletConnectProjectId } from '@/constants/evm'
import { EthereumClient } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { createPortal } from 'react-dom'

type Web3ModalPortalProps = {
  ethereumClient: EthereumClient
}

const Web3ModalPortal = ({ ethereumClient }: Web3ModalPortalProps) => {
  return createPortal(
    <Web3Modal
      themeVariables={{
        '--w3m-z-index': '50',
      }}
      projectId={walletConnectProjectId}
      ethereumClient={ethereumClient}
    />,
    document.body
  )
}

export default Web3ModalPortal
