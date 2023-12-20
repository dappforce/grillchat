import TextArea from '@/components/inputs/TextArea'
import { getWhitelistedAddressesInChatId } from '@/constants/chat'
import useIsAddressBlockedInChat from '@/hooks/useIsAddressBlockedInChat'
import { getCanUserDoDatahubActionQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getOffchainPostingHubs } from '@/utils/env/client'
import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'
import ChatForm, { ChatFormProps } from '../ChatForm'

const AttachmentInput = dynamic(import('./AttachmentInput'), { ssr: false })

type ChatInputBarProps = ComponentProps<'div'> & {
  formProps: ChatFormProps
}

export default function ChatInputBar({
  formProps,
  ...props
}: ChatInputBarProps) {
  const { chatId, hubId } = formProps
  const myAddress = useMyMainAddress()
  const isBlocked = useIsAddressBlockedInChat(
    myAddress ?? '',
    formProps.chatId,
    hubId
  )
  const { data: isAuthorized } = getCanUserDoDatahubActionQuery.useQuery(
    {
      address: myAddress ?? '',
      rootPostId: chatId,
    },
    {
      enabled: getOffchainPostingHubs().includes(hubId),
    }
  )

  const { data: accountData } = getAccountDataQuery.useQuery(myAddress ?? '')
  const myEvmAddress = accountData?.evmAddress

  const whitelistedAddresses = getWhitelistedAddressesInChatId(chatId)

  /*const isWhitelisted =
    whitelistedAddresses?.includes(myAddress ?? '') ||
    whitelistedAddresses?.includes(myEvmAddress?.toLowerCase() ?? '')

  if (whitelistedAddresses && (!myAddress || !isWhitelisted)) {
    return null
  }*/

  // DEISABLING  THE  AUTHORIZATION CHECKS
  /*if (isAuthorized === false) {
    return (
      <TextArea
        rows={1}
        disabled
        value='You cannot send message in this chat'
        className='bg-background-light/50 text-center text-text-muted !brightness-100'
        variant='fill'
        pill
      />
    )
  }*/

  if (isBlocked) {
    return (
      <TextArea
        rows={1}
        disabled
        value='You are blocked in this chat'
        className='bg-background-light/50 text-center text-text-muted !brightness-100'
        variant='fill'
        pill
      />
    )
  }

  return (
    <div {...props} className={cx('flex items-center gap-2', props.className)}>
      <AttachmentInput chatId={chatId} />
      <ChatForm {...formProps} />
    </div>
  )
}
