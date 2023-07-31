import Button from '@/components/Button'
import useSignMessage from '@/hooks/useSignMessage'
import {
  useCommitSignedMessageWithAction,
  useGetFcmLinkingMessage,
} from '@/services/api/notifications/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { LocalStorage } from '@/utils/storage'
import { sortObj } from 'jsonabc'
import { ContentProps } from '../types'

const FCM_PUSH_NOTIFICATION_STORAGE_KEY = 'push-notification-fcm-token'

const fcmTokenStorage = new LocalStorage(
  () => FCM_PUSH_NOTIFICATION_STORAGE_KEY
)

function LogoutContent({ setCurrentState }: ContentProps) {
  const { address } = useMyAccount()
  const logout = useMyAccount((state) => state.logout)
  const sendEvent = useSendEvent()

  const { mutate: commitSignedMessage, isLoading: isCommitingMessage } =
    useCommitSignedMessageWithAction({
      onSuccess: (data) => {
        if (!data) throw new Error('Error generating url')

        // FCM Token Disabled.
        fcmTokenStorage.remove()
      },
    })

  const processMessage = useProcessMessage()
  const { mutate: getLinkingMessage, isLoading: isGettingLinkingMessage } =
    useGetFcmLinkingMessage({
      onSuccess: async (data) => {
        const processedData = await processMessage(data)
        commitSignedMessage({
          signedMessageWithDetails: processedData,
        })
      },
    })

  const isLoading = isCommitingMessage || isGettingLinkingMessage

  const onShowPrivateKeyClick = () => {
    sendEvent('click no_show_me_my_private_key_button')
    setCurrentState('private-key')
  }
  const onLogoutClick = () => {
    sendEvent('click yes_log_out_button')
    logout()

    const fcmToken = fcmTokenStorage.get()

    if (fcmToken && address) {
      getLinkingMessage({ address, fcmToken, action: 'link' })
    }
  }

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <Button size='lg' onClick={onShowPrivateKeyClick}>
        No, show me my Grill secret key
      </Button>
      <Button
        isLoading={isLoading}
        size='lg'
        onClick={onLogoutClick}
        variant='primaryOutline'
      >
        Yes, log out
      </Button>
    </div>
  )
}

export default LogoutContent

function useProcessMessage() {
  const signMessage = useSignMessage()

  return async (data: { messageData: any; payloadToSign: string } | null) => {
    if (!data) throw new Error('No data')

    const signedPayload = await signMessage(data.payloadToSign)
    data.messageData['signature'] = signedPayload

    const signedMessage = encodeURIComponent(
      JSON.stringify(sortObj(data.messageData))
    )

    return signedMessage
  }
}
