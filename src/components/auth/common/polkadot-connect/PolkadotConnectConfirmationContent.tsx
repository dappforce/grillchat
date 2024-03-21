import LinkingDark from '@/assets/graphics/linking-dark.svg'
import LinkingLight from '@/assets/graphics/linking-light.svg'
import Button from '@/components/Button'
import Notice from '@/components/Notice'
import { sendEventWithRef } from '@/components/referral/analytics'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { estimatedWaitTime } from '@/utils/network'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
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
  const { mutateAsync: linkIdentity } = useLinkIdentity()
  const { data: proxies } = getProxiesQuery.useQuery(
    { address: connectedWallet?.address ?? '' },
    { enabled: !!connectedWallet?.address }
  )

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
              onSuccess: async () => {
                saveProxyAddress()
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

                {!!proxies?.length && (
                  <Notice noticeType='info'>
                    <div className='flex flex-col gap-2'>
                      <span>
                        ℹ️ You&apos;ve logged into this account from another
                        device. If you continue, the previous device will be
                        automatically disconnected.
                      </span>
                      <span>
                        You can connect to the same account with your Grill key
                        on the login screen.
                      </span>
                    </div>
                  </Notice>
                )}

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
                      await addProxy(null)
                      useLoginModal.getState().openNextStepModal({
                        step: 'save-grill-key',
                        provider: 'polkadot',
                      })

                      linkIdentity({
                        id: connectedWallet?.address ?? '',
                        provider: IdentityProvider.POLKADOT,
                      })
                      sendEventWithRef(
                        connectedWallet?.address ?? '',
                        (refId) => {
                          sendEvent(
                            'login',
                            { loginBy: 'polkadot' },
                            { ref: refId }
                          )
                        }
                      )
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
