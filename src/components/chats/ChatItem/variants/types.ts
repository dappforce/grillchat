import { ComponentProps, RefObject } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  isMyMessage: boolean
  isSent: boolean
  senderColor: string
  relativeTime: string
  ownerId: string
  body: string
  isEdited?: boolean
  isEditing?: boolean
  inReplyTo?: { id: string }
  scrollContainer?: RefObject<HTMLElement | null>
  onCheckMarkClick: () => void
  getRepliedElement?: (commentId: string) => Promise<HTMLElement | null>
}
