import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import ChatForm, { ChatFormProps } from '../ChatForm'
import AttachmentInput from './AttachmentInput'

type ChatInputBarProps = ComponentProps<'div'> & {
  formProps: ChatFormProps
}

export default function ChatInputBar({
  formProps,
  ...props
}: ChatInputBarProps) {
  return (
    <div {...props} className={cx('flex items-center gap-2', props.className)}>
      <AttachmentInput chatId={formProps.chatId} replyTo={formProps.replyTo} />
      <ChatForm {...formProps} />
    </div>
  )
}
