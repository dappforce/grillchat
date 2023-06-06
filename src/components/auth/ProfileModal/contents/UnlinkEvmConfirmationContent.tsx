import Button from '@/components/Button'
import { useUnlinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { useSendEvent } from '@/stores/analytics'
import { ContentProps } from '../types'

function UnlinkEvmConfirmationContent({
  setCurrentState,
  evmAddress,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const {
    mutate: unlinkEvmAddress,
    onCallbackLoading,
    isLoading,
  } = useUnlinkEvmAddress(() => setCurrentState('link-evm-address'))

  const onButtonClick = () => {
    setCurrentState('link-evm-address')
    sendEvent(`click keep-evm-address-linked`)
  }

  const onDisconnectClick = () => {
    if (!evmAddress) return
    sendEvent('click unlink-evm-address')
    unlinkEvmAddress({ evmAddress })
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onButtonClick}>
        No, keep it linked
      </Button>
      <Button
        size='lg'
        onClick={onDisconnectClick}
        variant='primaryOutline'
        className='border-red-500'
        isLoading={onCallbackLoading || isLoading}
      >
        Yes, unlink
      </Button>
    </div>
  )
}

export default UnlinkEvmConfirmationContent
