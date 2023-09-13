import { PostData } from '@subsocial/api/types'
import { ComponentProps, SyntheticEvent } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  chatId: string
  hubId: string
  message: PostData
  isMyMessage: boolean
  onCheckMarkClick: (e: SyntheticEvent) => void
  scrollToMessage?: (messageId: string) => Promise<void>
}
