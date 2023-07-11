import { getWhitelistedAddressesInChatId } from '@/constants/chat'
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
  const whitelistedAddresses = getWhitelistedAddressesInChatId(formProps.chatId)

  if (
    whitelistedAddresses &&
    (!myAddress || !whitelistedAddresses?.includes(myAddress))
  ) {
    return null
  }

  return (
    <div {...props} className={cx('flex items-center gap-2', props.className)}>
      <AttachmentInput chatId={formProps.chatId} />
      <ChatForm {...formProps} />
    </div>
  )
}
