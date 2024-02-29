import { CommonEVMLoginErrorContent } from '@/components/auth/common/evm/CommonEvmModalContent'
import { ProfileModalContentProps } from '@/components/auth/ProfileModal/types'

function EvmLoginError({
  setCurrentState,
  evmAddress,
}: ProfileModalContentProps) {
  return (
    <CommonEVMLoginErrorContent
      onSuccess={() => setCurrentState('link-evm-address')}
      onError={() => setCurrentState('evm-linking-error')}
    />
  )
}

export default EvmLoginError
