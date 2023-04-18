import { ComponentProps, RefObject, SyntheticEvent } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  isMyMessage: boolean
  isSent: boolean
  senderColor: string
  relativeTime: string
  ownerId: string
  body: string
  inReplyTo?: { id: string }
  scrollContainer?: RefObject<HTMLElement | null>
  onCheckMarkClick: (e: SyntheticEvent) => void
  getRepliedElement?: (commentId: string) => Promise<HTMLElement | null>
}
