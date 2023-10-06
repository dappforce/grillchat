import { ContentProps } from '@/components/auth/ProfileModal/types'
import Button from '@/components/Button'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { UnlinkEvmAddressWrapper } from '@/services/subsocial/evmAddresses/mutation'
import { useEffect, useState } from 'react'

function UnlinkEvmConfirmationContent({
  setCurrentState,
  address,
  evmAddress,
}: ContentProps) {
  const { isStale } = getAccountDataQuery.useQuery(address)
  const [doneUnlinking, setDoneUnlinking] = useState(false)

  const onButtonClick = () => {
    setCurrentState('link-evm-address')
  }

  useEffect(() => {
    if (!evmAddress && doneUnlinking) {
      setCurrentState('link-evm-address')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAddress, doneUnlinking])

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onButtonClick}>
        No, keep it linked
      </Button>
      <UnlinkEvmAddressWrapper
        loadingUntilTxSuccess
        config={{ txCallbacks: { onSuccess: () => setDoneUnlinking(true) } }}
      >
        {({ mutateAsync, isLoading }) => (
          <Button
            size='lg'
            onClick={() => {
              if (!evmAddress) return
              mutateAsync({ evmAddress })
            }}
            variant='primaryOutline'
            className='border-red-500'
            isLoading={isLoading || isStale}
          >
            Yes, unlink
          </Button>
        )}
      </UnlinkEvmAddressWrapper>
    </div>
  )
}

export default UnlinkEvmConfirmationContent
