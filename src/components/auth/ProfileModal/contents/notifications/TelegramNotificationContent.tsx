import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import { useLinkTelegramAccount } from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useSendEvent } from '@/stores/analytics'
import { getIsInIos } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ProfileModalContentProps } from '../../types'

export default function TelegramNotificationContent(
  props: ProfileModalContentProps
) {
  const { address } = props
  const [isAfterDisconnect, setIsAfterDisconnect] = useState(false)
  const [isAfterConnect, setIsAfterConnect] = useState(false)

  const {
    data: linkedAccounts,
    isLoading,
    isFetching,
  } = getLinkedTelegramAccountsQuery.useQuery({
    address,
  })
  const isLoadingAccount = isLoading || isFetching
  const { IntegratedSkeleton } = useIntegratedSkeleton(isLoadingAccount)
  const hasLinkedAccount = !isLoadingAccount ? linkedAccounts?.[0] : null

  if (!isLoadingAccount && !hasLinkedAccount) {
    return (
      <>
        {isAfterDisconnect && (
          <Notice className='mb-6' leftIcon='✅'>
            You have disconnected your account from Grill&apos;s telegram bot.
          </Notice>
        )}
        <ConnectTelegramButton
          {...props}
          afterConnect={() => setIsAfterConnect(true)}
        />
      </>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card className='flex justify-between gap-4 overflow-hidden'>
        <IntegratedSkeleton
          content={hasLinkedAccount?.userName}
          className='bg-black/20'
        >
          {(userName) => (
            <span className='overflow-hidden text-ellipsis font-medium'>
              @{userName}
            </span>
          )}
        </IntegratedSkeleton>
        <IntegratedSkeleton
          content={hasLinkedAccount?.userName}
          className='w-24 bg-black/20'
        >
          {() => (
            <LinkText
              className='flex-shrink-0'
              withArrow
              href='https://t.me/grill_notifications_bot'
              openInNewTab
              variant='primary'
            >
              Open bot
            </LinkText>
          )}
        </IntegratedSkeleton>
      </Card>
      {hasLinkedAccount &&
        (isAfterConnect ? (
          <Button
            variant='primary'
            size='lg'
            onClick={() => props.setCurrentState('notifications')}
          >
            Got it
          </Button>
        ) : (
          <DisconnectButton
            {...props}
            afterDisconnect={() => setIsAfterDisconnect(true)}
          />
        ))}
    </div>
  )
}

function DisconnectButton({
  address,
  afterDisconnect,
}: ProfileModalContentProps & { afterDisconnect?: () => void }) {
  const { mutate: getLinkingMessage, isLoading } = useLinkTelegramAccount({
    onSuccess: () => {
      afterDisconnect?.()
    },
  })

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

function ConnectTelegramButton({
  address,
  afterConnect,
}: ProfileModalContentProps & { afterConnect?: () => void }) {
  const queryClient = useQueryClient()
  const { isFetching: isFetchingAccount } =
    getLinkedTelegramAccountsQuery.useQuery({
      address,
    })
  const sendEvent = useSendEvent()

  const {
    data: url,
    mutate: getLinkingMessage,
    isLoading,
  } = useLinkTelegramAccount({
    onSuccess: async (url) => {
      if (!url) throw new Error('Error generating url')
      if (!getIsInIos()) {
        window.open(url, '_blank')
        sendEvent('open_tg_notifs_bot_link')
      }
    },
  })

  const handleClickLinking = async () => {
    if (!address) return
    sendEvent('start_connecting_tg_notifs')
    getLinkingMessage({ address, action: 'link' })
  }

  const handleClickReload = () => {
    getLinkedTelegramAccountsQuery.invalidate(queryClient, { address })
    afterConnect?.()
  }

  return url ? (
    <div className='flex flex-col gap-4'>
      <Card className='flex flex-col justify-between overflow-hidden'>
        <span className='text-sm text-text-muted'>
          Open the link below to connect to telegram bot
        </span>
        <LinkText openInNewTab variant='primary'>
          {url}
        </LinkText>
      </Card>
      <Button
        size='lg'
        variant='primaryOutline'
        onClick={handleClickReload}
        isLoading={isFetchingAccount}
      >
        I have connected the bot
      </Button>
    </div>
  ) : (
    <Button size='lg' onClick={handleClickLinking} isLoading={isLoading}>
      Connect Telegram
    </Button>
  )
}
