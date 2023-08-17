import { ContentProps } from '@/components/auth/ProfileModal/types'
import Button from '@/components/Button'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useUnlinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { useEffect } from 'react'

function UnlinkEvmConfirmationContent({
  setCurrentState,
  address,
  evmAddress,
}: ContentProps) {
  const { isStale } = getAccountDataQuery.useQuery(address)

  const {
    mutate: unlinkEvmAddress,
    onCallbackLoading,
    isLoading,
  } = useUnlinkEvmAddress()

  const onButtonClick = () => {
    setCurrentState('link-evm-address')
  }

  useEffect(() => {
    if (!evmAddress && !onCallbackLoading) {
      setCurrentState('link-evm-address')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAddress, onCallbackLoading])

  const onDisconnectClick = () => {
    if (!evmAddress) return
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
