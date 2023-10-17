import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Button from '@/components/Button'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { useMyAccount } from '@/stores/my-account'
import { toSubsocialAddress } from '@subsocial/utils'
import Image from 'next/image'
import { ContentProps } from '../../types'

export default function PolkadotConnectConfirmationContent({
  setCurrentState,
}: ContentProps) {
  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const isLoadingEnergy = useMyAccount(
    (state) => state.connectedWallet?.energy === undefined
  )
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const saveProxyAddress = useMyAccount((state) => state.saveProxyAddress)

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex w-full flex-col items-center gap-4'>
        <Image
          className='w-64 max-w-xs rounded-full'
          priority
          src={ProcessingHumster}
          alt=''
        />
        <AddProxyWrapper
          loadingUntilTxSuccess
          config={{
            txCallbacks: {
              onSuccess: () => {
                saveProxyAddress()
                setCurrentState('polkadot-connect-success')
              },
            },
          }}
        >
          {({ isLoading, mutateAsync: addProxy }) => {
            return (
              <Button
                className='w-full'
                size='lg'
                onClick={async () => {
                  const address = toSubsocialAddress(connectedWallet?.address)
                  const signer = connectedWallet?.signer
                  if (address && signer) {
                    connectWallet(address, signer)
                    addProxy(null)
                  }
                }}
                isLoading={isLoading || isLoadingEnergy}
              >
                Confirm
              </Button>
            )
          }}
        </AddProxyWrapper>
      </div>
    </div>
  )
}
