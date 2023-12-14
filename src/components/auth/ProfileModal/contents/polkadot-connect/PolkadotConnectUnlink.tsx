import Button from '@/components/Button'
import { RemoveProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { ProfileModalContentProps } from '../../types'

export default function PolkadotConnectUnlink({
  setCurrentState,
  address,
}: ProfileModalContentProps) {
  const sendEvent = useSendEvent()
  const { isStale } = getProxiesQuery.useQuery({ address })
  const disconnectProxy = useMyAccount((state) => state.disconnectProxy)

  const onButtonClick = () => {
    setCurrentState('polkadot-connect')
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onButtonClick}>
        No, keep it linked
      </Button>
      <RemoveProxyWrapper
        loadingUntilTxSuccess
        config={{
          txCallbacks: {
            onSuccess: () => {
              sendEvent('polkadot_address_unlinked', undefined, {
                polkadotLinked: false,
              })
              setCurrentState('linked-addresses')
              disconnectProxy()
            },
          },
        }}
      >
        {({ mutateAsync, isLoading }) => (
          <Button
            size='lg'
            onClick={() => mutateAsync(null)}
            variant='primaryOutline'
            className='border-red-500'
            isLoading={isLoading || isStale}
          >
            Yes, unlink
          </Button>
        )}
      </RemoveProxyWrapper>
    </div>
  )
}
