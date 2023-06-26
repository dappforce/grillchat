import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import useSignMessage from '@/hooks/useSignMessage'
import {
  useCreateLinkingUrl,
  useGetLinkingMessage,
} from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useQueryClient } from '@tanstack/react-query'
import { sortObj } from 'jsonabc'
import { useState } from 'react'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent(props: ContentProps) {
  const { address } = props
  const { data: linkedAccounts } = getLinkedTelegramAccountsQuery.useQuery({
    address,
  })
  const firstLinkedAccount = linkedAccounts?.[0]

  if (!firstLinkedAccount) {
    return <ConnectTelegramBot {...props} />
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='flex justify-between'>
        <span className='font-medium'>@{firstLinkedAccount.userName}</span>
        <LinkText withArrow href={''} openInNewTab variant='primary'>
          Open bot
        </LinkText>
      </Card>
      <Button variant='redOutline' size='lg'>
        Disconnect
      </Button>
    </div>
  )
}

function ConnectTelegramBot({ address }: ContentProps) {
  const queryClient = useQueryClient()
  const { isFetching: isFetchingAccount } =
    getLinkedTelegramAccountsQuery.useQuery({
      address,
    })
  const [openedTelegramBotLink, setOpenedTelegramBotLink] = useState(false)

  const signMessage = useSignMessage()
  const { mutate: createLinkUrl, isLoading: isCreatingLinkingUrl } =
    useCreateLinkingUrl({
      onSuccess: (url) => {
        if (!url) throw new Error('Error generating url')
        window.open(url, '_blank')
        setOpenedTelegramBotLink(true)
      },
    })

  const { mutate: getLinkingMessage, isLoading: isGettingLinkingMessage } =
    useGetLinkingMessage({
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

  const isLoading = isCreatingLinkingUrl || isGettingLinkingMessage

  const handleClickLinking = async () => {
    if (!address) return
    getLinkingMessage({ address })
  }

  const handleClickReload = () => {
    getLinkedTelegramAccountsQuery.invalidate(queryClient)
  }

  return openedTelegramBotLink ? (
    <Button size='lg' onClick={handleClickReload} isLoading={isFetchingAccount}>
      I have connected the bot
    </Button>
  ) : (
    <Button size='lg' onClick={handleClickLinking} isLoading={isLoading}>
      Connect Telegram
    </Button>
  )
}
