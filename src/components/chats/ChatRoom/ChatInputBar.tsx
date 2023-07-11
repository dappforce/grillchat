import { getWhitelistedAddressesInChatId } from '@/constants/chat'
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
  const { data: accountData } = getAccountDataQuery.useQuery(myAddress ?? '')
  const myEvmAddress = accountData?.evmAddress

  const whitelistedAddresses = getWhitelistedAddressesInChatId(formProps.chatId)

  const isWhitelisted =
    whitelistedAddresses?.includes(myAddress ?? '') ||
    whitelistedAddresses?.includes(myEvmAddress?.toLowerCase() ?? '')

  if (whitelistedAddresses && (!myAddress || !isWhitelisted)) {
    return null
  }

  return (
    <div {...props} className={cx('flex items-center gap-2', props.className)}>
      <AttachmentInput chatId={formProps.chatId} />
      <ChatForm {...formProps} />
    </div>
  )
}
