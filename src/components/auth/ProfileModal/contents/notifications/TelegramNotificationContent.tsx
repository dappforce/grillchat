import Button from '@/components/Button'
import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import Toast from '@/components/Toast'
import useSignMessage from '@/hooks/useSignMessage'
import {
  useGetLinkingMessage,
  useLinkingAccount,
} from '@/services/api/notifications/mutation'
import { getLinkedTelegramAccountsQuery } from '@/services/api/notifications/query'
import { getIsInIos } from '@/utils/window'
import { useQueryClient } from '@tanstack/react-query'
import { sortObj } from 'jsonabc'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { HiArrowUpRight } from 'react-icons/hi2'
import { ContentProps } from '../../types'

export default function TelegramNotificationContent(props: ContentProps) {
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
          <Card className='mb-6 bg-green-600/10 text-green-600'>
            ✅ You have disconnected your account from Grill&apos;s telegram
            bot.
          </Card>
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
              href='https://t.me/GrillNotificationsStagingBot'
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
}: ContentProps & { afterDisconnect?: () => void }) {
  const queryClient = useQueryClient()

  const { mutate: disconnect, isLoading: isCreatingLinkingUrl } =
    useLinkingAccount({
      onSuccess: () => {
        getLinkedTelegramAccountsQuery.invalidate(queryClient, { address })
        afterDisconnect?.()
      },
    })

  const processMessage = useProcessMessage()
  const { mutate: getLinkingMessage, isLoading: isGettingLinkingMessage } =
    useGetLinkingMessage({
      onSuccess: async (data) => {
        const processedData = await processMessage(data)
        disconnect({
          action: 'unlink',
          signedMessageWithDetails: processedData,
        })
      },
    })

  const isLoading = isCreatingLinkingUrl || isGettingLinkingMessage

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

  const { mutate: createLinkUrl, isLoading: isCreatingLinkingUrl } =
    useLinkingAccount({
      onSuccess: (url) => {
        if (!url) throw new Error('Error generating url')
        if (!getIsInIos()) {
          window.open(url, '_blank')
          setOpenedTelegramBotLink(true)
        } else {
          toast.custom(
            (t) => (
              <Toast
                t={t}
                title='Please open this link to connect your telegram'
                description='You will be redirected to grill telegram bot.'
                action={
                  <Button
                    size='circle'
                    className='ml-2'
                    href={url}
                    target='_blank'
                    onClick={() => {
                      toast.dismiss(t.id)
                      setOpenedTelegramBotLink(true)
                    }}
                  >
                    <HiArrowUpRight />
                  </Button>
                }
              />
            ),
            { duration: Infinity }
          )
        }
      },
    })

  const processMessage = useProcessMessage()
  const { mutate: getLinkingMessage, isLoading: isGettingLinkingMessage } =
    useGetLinkingMessage({
      onSuccess: async (data) => {
        const processedData = await processMessage(data)
        createLinkUrl({
          signedMessageWithDetails: processedData,
          action: 'link',
        })
      },
    })

  const isLoading = isCreatingLinkingUrl || isGettingLinkingMessage

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
