import Button from '@/components/Button'
import useSignMessage from '@/hooks/useSignMessage'
import {
  useCreateLinkingUrl,
  useGetLinkingMessage,
} from '@/services/api/notifications/mutation'
import { sortObj } from 'jsonabc'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent({ address }: ContentProps) {
  const signMessage = useSignMessage()
  const { mutate: createLinkUrl, data: url } = useCreateLinkingUrl()

  const { mutate: getLinkingMessage } = useGetLinkingMessage({
    onSuccess: async (data) => {
      if (!data) throw new Error('No data')

      const signedPayload = await signMessage(data.payloadToSign)
      data.messageData['signature'] = signedPayload

      const signedMessage = encodeURIComponent(
        JSON.stringify(sortObj(data.messageData))
      )
      createLinkUrl({ signedMessageWithDetails: signedMessage })
    },
  })

  const handleClick = async () => {
    getLinkingMessage({ address })
  }

  return (
    <Button size='lg' onClick={handleClick}>
      Connect Telegram
    </Button>
  )
}
