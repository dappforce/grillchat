import Button from '@/components/Button'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useUnlinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useEffect } from 'react'
import { ContentProps } from '../../types'

function UnlinkEvmConfirmationContent({
  setCurrentState,
  address,
  evmAddress,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const { isStale } = getAccountDataQuery.useQuery(address)

  const {
    mutate: unlinkEvmAddress,
    onCallbackLoading,
    isLoading,
  } = useUnlinkEvmAddress()

  const onButtonClick = () => {
    setCurrentState('link-evm-address')
    sendEvent(`click keep-evm-address-linked`)
  }

  useEffect(() => {
    if (!evmAddress && !onCallbackLoading) {
      setCurrentState('link-evm-address')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAddress, onCallbackLoading])

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
        isLoading={onCallbackLoading || isLoading || isStale}
      >
        Yes, unlink
      </Button>
    </div>
  )
}

export default UnlinkEvmConfirmationContent
