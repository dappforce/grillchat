import Spinner from '@/components/Spinner'
import Toast from '@/components/Toast'
import { sendEventWithRef } from '@/components/referral/analytics'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSendEvent } from '@/stores/analytics'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey } from '@/utils/account'
import { useQueryClient } from '@tanstack/react-query'
import QrScanner from 'qr-scanner'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { LoginModalContentProps } from '../LoginModalContent'
import { finishLogin } from '../utils'

export default function ScanQrContent({ closeModal }: LoginModalContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const login = useMyAccount.use.login()
  const sendEvent = useSendEvent()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!videoRef.current) return

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        if (isLoading) return

        setIsLoading(true)
        try {
          const sk = result.data.split(`${ACCOUNT_SECRET_KEY_URL_PARAMS}=`)[1]
          const grillKey = decodeSecretKey(decodeURIComponent(sk)).trim()
          const address = await login(grillKey, { withErrorToast: false })
          if (!address) throw new Error('Invalid secret key')

          const mainAddress =
            useMyAccount.getState().parentProxyAddress || address
          if (mainAddress) {
            const profile = await getProfileQuery.fetchQuery(
              queryClient,
              mainAddress
            )

            if (!profile?.profileSpace?.id) {
              useLoginModal
                .getState()
                .openNextStepModal({ step: 'create-profile' })
              closeModal()

              sendEventWithRef(mainAddress, (refId) => {
                sendEvent(
                  'login',
                  { eventSource: 'login_modal', loginBy: 'grill-key-qr' },
                  { ref: refId }
                )
              })
            } else {
              await sendEventWithRef(mainAddress, (refId) => {
                sendEvent(
                  'login',
                  { eventSource: 'login_modal', loginBy: 'grill-key-qr' },
                  { ref: refId }
                )
              })

              finishLogin(closeModal)
            }
          }
        } catch (err) {
          console.error('Error reading qr', err)
          toast.custom((t) => (
            <Toast
              t={t}
              title='QR Code is not valid'
              description='Please provide valid Epic "Share my session" QR code'
            />
          ))
        } finally {
          setIsLoading(false)
        }
      },
      { highlightScanRegion: true, maxScansPerSecond: 1 }
    )
    scanner.start()
    return () => {
      scanner.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='relative aspect-square w-full overflow-clip rounded-xl bg-background'>
      <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
        Allow camera to scan QR
      </span>
      <video ref={videoRef} className='h-full w-full object-cover' />
      {isLoading && (
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <Spinner className='h-16 w-16' />
        </div>
      )}
    </div>
  )
}
