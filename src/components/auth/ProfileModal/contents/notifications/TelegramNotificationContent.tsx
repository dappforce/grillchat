import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import Toast from '@/components/Toast'
import { useLinkTelegramAccount } from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { useSendEvent } from '@/stores/analytics'
import { getIsInIos } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiArrowUpRight } from 'react-icons/hi2'
import { ProfileModalContentProps } from '../../types'

export default function TelegramNotificationContent(
  props: ProfileModalContentProps
) {
  const { address } = props
  const [isAfterDisconnect, setIsAfterDisconnect] = useState(false)

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
    return (
      <>
        {isAfterDisconnect && (
          <Notice className='mb-6' leftIcon='✅'>
            You have disconnected your account from Grill&apos;s telegram bot.
          </Notice>
        )}
        <ConnectTelegramButton {...props} />
      </>
    )
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
              href='https://t.me/grill_notifications_bot'
              openInNewTab
              variant='primary'
            >
              Open bot
            </LinkText>
          )}
        </IntegratedSkeleton>
      </Card>
      {firstLinkedAccount && (
        <DisconnectButton
          {...props}
          afterDisconnect={() => setIsAfterDisconnect(true)}
        />
      )}
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

function ConnectTelegramButton({ address }: ProfileModalContentProps) {
  const queryClient = useQueryClient()
  const { isFetching: isFetchingAccount } =
    getLinkedTelegramAccountsQuery.useQuery({
      address,
    })
  const [openedTelegramBotLink, setOpenedTelegramBotLink] = useState(false)
  const sendEvent = useSendEvent()

  const { mutate: getLinkingMessage, isLoading } = useLinkTelegramAccount({
    onSuccess: async (url) => {
      if (!url) throw new Error('Error generating url')
      if (!getIsInIos()) {
        window.open(url, '_blank')
        setOpenedTelegramBotLink(true)
        sendEvent('open_tg_notifs_bot_link')
      }

      toast.custom(
        (t) => (
          <Toast
            t={t}
            title='Use this link to connect your Telegram'
            description='You will be taken to the Grill bot.'
            action={
              <Button
                size='circle'
                className='text-lg'
                href={url}
                target='_blank'
                onClick={() => {
                  toast.dismiss(t.id)
                  setOpenedTelegramBotLink(true)
                  sendEvent('open_tg_notifs_bot_link')
                }}
              >
                <HiArrowUpRight />
              </Button>
            }
          />
        ),
        { duration: Infinity }
      )
    },
  })

  const handleClickLinking = async () => {
    if (!address) return
    sendEvent('start_connecting_tg_notifs')
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
