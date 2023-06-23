import Button from '@/components/Button'
import useSignMessage from '@/hooks/useSignMessage'
import { useGetLinkingMessageForTelegramAccount } from '@/services/notifications/mutation'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent({ address }: ContentProps) {
  const buildLinkMessage = useBuildLinkMessage()

  const { mutate: getLinkingMessage } = useGetLinkingMessageForTelegramAccount({
    onSuccess: async (message) => {
      const payload = await buildLinkMessage(decodeURIComponent(message))
      console.log(payload)
    },
  })

  const handleClick = async () => {
    getLinkingMessage(address)
  }

  return (
    <Button size='lg' onClick={handleClick}>
      Connect Telegram
    </Button>
  )
}

function useBuildLinkMessage() {
  const address = useMyAccount((state) => state.address)
  const signMessage = useSignMessage()

  return async (message: string) => {
    const decodedMessage = decodeURIComponent(message)
    const signedMessage = await signMessage(decodedMessage)

    const messageData = {
      action: 'LINK_TELEGRAM_ACCOUNT',
      address,
      signature: signedMessage,
      payload: decodedMessage,
    }

    return JSON.stringify(messageData)
  }
}
