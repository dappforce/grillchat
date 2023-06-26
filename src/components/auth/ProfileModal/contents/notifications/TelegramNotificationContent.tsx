import Button from '@/components/Button'
import useSignMessage from '@/hooks/useSignMessage'
import { useGetLinkingMessage } from '@/services/api/notifications/mutation'
import { useMyAccount } from '@/stores/my-account'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent({ address }: ContentProps) {
  const buildLinkMessage = useBuildLinkMessage()

  const { mutate: getLinkingMessage } = useGetLinkingMessage({
    onSuccess: async (message) => {
      const payload = await buildLinkMessage(message ?? '')
      console.log(payload)
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

function useBuildLinkMessage() {
  const address = useMyAccount((state) => state.address)
  const signMessage = useSignMessage()

  return async (message: string) => {
    const signedMessage = await signMessage(message)

    const messageData = {
      action: 'LINK_TELEGRAM_ACCOUNT',
      address,
      signature: signedMessage,
      payload: message,
    }

    return JSON.stringify(messageData)
  }
}
