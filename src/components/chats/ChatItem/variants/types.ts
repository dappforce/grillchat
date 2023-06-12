import { Extension } from '@/@types/subsocial'
import { ComponentProps, SyntheticEvent } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  isMyMessage: boolean
  isSent: boolean
  relativeTime: string
  ownerId: string
  body: string
  inReplyTo?: { id: string }
  extensions?: Extension[]
  onCheckMarkClick: (e: SyntheticEvent) => void
  scrollToMessage?: (messageId: string) => Promise<void>
}
