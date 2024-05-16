import { useSendEvent } from '@/stores/analytics'
import { useState } from 'react'
import { CommonEVMLoginContent } from '../../common/evm/CommonEvmModalContent'
import { ProfileModalContentProps } from '../types'

export default function AddEvmProviderContent({
  setCurrentState,
}: ProfileModalContentProps) {
  const [isError, setIsError] = useState(false)
  const sendEvent = useSendEvent()

  return (
    <CommonEVMLoginContent
      mutationType='add-provider'
      buttonLabel={isError ? 'Try again' : undefined}
      onError={() => {
        setIsError(true)
      }}
      onSuccess={() => {
        sendEvent(`finish_add_provider_evm_standalone`)
        setCurrentState('linked-identities')
      }}
    />
  )
}
