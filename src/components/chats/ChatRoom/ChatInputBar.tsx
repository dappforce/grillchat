import TextArea from '@/components/inputs/TextArea'
import { getWhitelistedAddressesInChatId } from '@/constants/chat'
import useIsAddressBlockedInChat from '@/hooks/useIsAddressBlockedInChat'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
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
  const myAddress = useMyAccount((state) => state.address)

  const { chatId, hubId } = formProps
  const isBlocked = useIsAddressBlockedInChat(myAddress ?? '', chatId, hubId)

  const { data: accountData } = getAccountDataQuery.useQuery(myAddress ?? '')
  const myEvmAddress = accountData?.evmAddress

  const whitelistedAddresses = getWhitelistedAddressesInChatId(chatId)

  const isWhitelisted =
    whitelistedAddresses?.includes(myAddress ?? '') ||
    whitelistedAddresses?.includes(myEvmAddress?.toLowerCase() ?? '')

  if (whitelistedAddresses && (!myAddress || !isWhitelisted)) {
    return null
  }

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
