import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import { useLinkingAccount } from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent(props: ContentProps) {
  const { address } = props
  const {
    data: linkedAccounts,
    isLoading,
    isFetching,
  } = getLinkedTelegramAccountsQuery.useQuery({
    address,
  })
  const isLoadingAccount = isLoading || isFetching
  const { IntegratedSkeleton } = useIntegratedSkeleton(isLoadingAccount)
  const firstLinkedAccount = !isLoadingAccount ? linkedAccounts?.[0] : null

  if (!isLoadingAccount && !firstLinkedAccount) {
    return <ConnectTelegramButton {...props} />
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='flex justify-between gap-4 overflow-hidden'>
        <IntegratedSkeleton
          content={firstLinkedAccount?.userName}
          className='bg-black/20'
        >
          {(userName) => (
            <span className='overflow-hidden text-ellipsis font-medium'>
              @{userName}
            </span>
          )}
        </IntegratedSkeleton>
        <IntegratedSkeleton
          content={firstLinkedAccount?.userName}
          className='w-24 bg-black/20'
        >
          {() => (
            <LinkText
              className='flex-shrink-0'
              withArrow
              href='https://t.me/GrillNotificationsStagingBot'
              openInNewTab
              variant='primary'
            >
              Open bot
            </LinkText>
          )}
        </IntegratedSkeleton>
      </Card>
      {firstLinkedAccount && <DisconnectButton {...props} />}
    </div>
  )
}

function DisconnectButton({ address }: ContentProps) {
  const { mutate: getLinkingMessage, isLoading } = useLinkingAccount()

  const handleClick = async () => {
    if (!address) return
    getLinkingMessage({ address, action: 'unlink' })
  }

  return (
    <Button
      size='lg'
      variant='redOutline'
      onClick={handleClick}
      isLoading={isLoading}
    >
      Disconnect
    </Button>
  )
}

function ConnectTelegramButton({ address }: ContentProps) {
  const queryClient = useQueryClient()
  const { isFetching: isFetchingAccount } =
    getLinkedTelegramAccountsQuery.useQuery({
      address,
    })
  const [openedTelegramBotLink, setOpenedTelegramBotLink] = useState(false)

  const { mutate: getLinkingMessage, isLoading } = useLinkingAccount({
    onSuccess: async (url) => {
      if (!url) throw new Error('Error generating url')
      window.open(url, '_blank')
      setOpenedTelegramBotLink(true)
    },
  })

  const handleClickLinking = async () => {
    if (!address) return
    getLinkingMessage({ address, action: 'link' })
  }

  const handleClickReload = () => {
    getLinkedTelegramAccountsQuery.invalidate(queryClient, { address })
  }

  return openedTelegramBotLink ? (
    <Button
      size='lg'
      variant='primaryOutline'
      onClick={handleClickReload}
      isLoading={isFetchingAccount}
    >
      I have connected the bot
    </Button>
  ) : (
    <Button size='lg' onClick={handleClickLinking} isLoading={isLoading}>
      Connect Telegram
    </Button>
  )
}
