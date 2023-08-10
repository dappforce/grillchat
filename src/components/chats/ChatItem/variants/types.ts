import { PostContent } from '@subsocial/api/types'
import { ComponentProps, SyntheticEvent } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  chatId: string
  hubId: string
  messageId: string
  isMyMessage: boolean
  isSent: boolean
  createdAtTime: number
  ownerId: string
  body: string
  inReplyTo?: { id: string }
  extensions?: PostContent['extensions']
  onCheckMarkClick: (e: SyntheticEvent) => void
  scrollToMessage?: (messageId: string) => Promise<void>
}
