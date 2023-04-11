import { ComponentProps } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  isMyMessage: boolean
  isSent: boolean
  senderColor: string
  relativeTime: string
  ownerId: string
  body: string
  inReplyTo?: { id: string }
  onCheckMarkClick: () => void
}
