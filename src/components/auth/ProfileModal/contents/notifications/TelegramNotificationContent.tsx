import GrillNotificationImage from '@/assets/graphics/grill-notification-bot.jpg'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DataCard from '@/components/DataCard'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import useToastError from '@/hooks/useToastError'
import { useLinkTelegramAccount } from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useSendEvent } from '@/stores/analytics'
import { getIsInIos } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
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
            You have disconnected your account from Grill&apos;s Telegram bot.
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
      {!isLoadingAccount && (
        <Notice leftIcon='✅'>Telegram Notifications Enabled</Notice>
      )}
      <DataCard
        data={[
          {
            title: 'Your Telegram Username',
            content: (
              <IntegratedSkeleton
                content={hasLinkedAccount?.userName}
                className='bg-black/20'
              >
                {(userName) => (
                  <LinkText
                    openInNewTab
                    href={`https://t.me/${userName}`}
                    variant='primary'
                    className='overflow-hidden text-ellipsis'
                  >
                    @{userName}
                  </LinkText>
                )}
              </IntegratedSkeleton>
            ),
          },
          {
            title: 'Telegram Bot for Grill',
            content: (
              <LinkText
                href='https://t.me/grill_notifications_bot'
                variant='primary'
                className='mt-1 flex items-center gap-2'
                openInNewTab
              >
                <Image
                  src={GrillNotificationImage}
                  alt=''
                  width={32}
                  height={32}
                  className='h-6 w-6 rounded-full'
                />
                <span>Grill Notifications</span>
              </LinkText>
            ),
          },
        ]}
      />
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
    getLinkingMessage({ action: 'unlink' })
  }

  return (
    <Button
      size='lg'
      variant='redOutline'
      onClick={handleClick}
      isLoading={isLoading}
    >
      Disconnect Telegram
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
    error,
  } = useLinkTelegramAccount({
    onSuccess: async (url) => {
      if (!url) throw new Error('Error generating url')
      if (!getIsInIos()) {
        window.open(url, '_blank')
        sendEvent('open_tg_notifs_bot_link')
      }
    },
  })
  useToastError(error, 'Failed to enable telegram notifications')

  const handleClickLinking = async () => {
    if (!address) return
    sendEvent('start_connecting_tg_notifs')
    getLinkingMessage({ action: 'link' })
  }

  const handleClickReload = () => {
    getLinkedTelegramAccountsQuery.invalidate(queryClient, { address })
    afterConnect?.()
  }

  return url ? (
    <div className='flex flex-col gap-4'>
      <Card className='flex flex-col justify-between overflow-hidden'>
        <span className='text-sm text-text-muted'>
          Open the link below to connect to Telegram bot
        </span>
        <LinkText openInNewTab href={url} variant='primary'>
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
