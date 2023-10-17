import Button from '@/components/Button'
import { RemoveProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../../types'

export default function PolkadotConnectUnlink({
  setCurrentState,
  address,
}: ContentProps) {
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
              disconnectProxy()
              setCurrentState('polkadot-connect')
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
