import { CommonEVMLoginErrorContent } from '../../../CommonModalContent'
import { ContentProps } from '../../types'

function EvmLoginError({ setCurrentState, evmAddress }: ContentProps) {
  return (
    <CommonEVMLoginErrorContent
      setModalStep={() => setCurrentState('link-evm-address')}
      onError={() => setCurrentState('evm-linking-error')}
      signAndLinkOnConnect={!evmAddress}
    />
  )
}

export default EvmLoginError
