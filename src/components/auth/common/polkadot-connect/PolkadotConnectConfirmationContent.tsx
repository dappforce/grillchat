import LinkingDark from '@/assets/graphics/linking-dark.svg'
import LinkingLight from '@/assets/graphics/linking-light.svg'
import Button from '@/components/Button'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { estimatedWaitTime } from '@/utils/network'
import { toSubsocialAddress } from '@subsocial/utils'
import { useState } from 'react'
import { PolkadotConnectContentProps } from './types'

export default function PolkadotConnectConfirmationContent({
  closeModal,
  beforeAddProxy,
  onError,
  onSuccess,
}: PolkadotConnectContentProps & {
  onSuccess?: () => void
  onError?: () => void
  beforeAddProxy?: () => Promise<boolean>
}) {
  const sendEvent = useSendEvent()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const isLoadingEnergy = useMyAccount(
    (state) => state.connectedWallet?.energy === undefined
  )
  const saveProxyAddress = useMyAccount((state) => state.saveProxyAddress)

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex w-full flex-col items-center gap-4'>
        <AddProxyWrapper
          loadingUntilTxSuccess
          config={{
            txCallbacks: {
              onSend: () => {
                setIsSent(true)
              },
              onSuccess: () => {
                saveProxyAddress()
                sendEvent(
                  'login',
                  { loginBy: 'polkadot' },
                  { ref: getReferralIdInUrl() }
                )
                sendEvent('polkadot_address_linked', undefined, {
                  polkadotLinked: true,
                })
                onSuccess?.()
                closeModal()
              },
              onError,
            },
            onError,
          }}
        >
          {({ isLoading: isAddingProxy, mutateAsync: addProxy }) => {
            return (
              <>
                <div className='mb-2 w-full'>
                  {isAddingProxy || isProcessing ? (
                    <div className='animate-pulse'>
                      <LinkingLight className='block w-full dark:hidden' />
                      <LinkingDark className='hidden w-full dark:block' />
                    </div>
                  ) : (
                    <>
                      <LinkingLight className='block w-full dark:hidden' />
                      <LinkingDark className='hidden w-full dark:block' />
                    </>
                  )}
                </div>

                <Button
                  className='w-full'
                  size='lg'
                  onClick={async () => {
                    const address = toSubsocialAddress(connectedWallet?.address)
                    const signer = connectedWallet?.signer
                    if (address && signer) {
                      setIsProcessing(true)
                      const shouldProceed = beforeAddProxy
                        ? await beforeAddProxy?.()
                        : true
                      setIsProcessing(false)
                      if (!shouldProceed) return
                      addProxy(null)
                    }
                  }}
                  isLoading={isAddingProxy || isLoadingEnergy || isProcessing}
                  loadingText={
                    isSent
                      ? `It may take up to ${estimatedWaitTime} seconds`
                      : isAddingProxy
                      ? 'Pending Confirmation...'
                      : undefined
                  }
                >
                  Confirm
                </Button>
              </>
            )
          }}
        </AddProxyWrapper>
      </div>
    </div>
  )
}
