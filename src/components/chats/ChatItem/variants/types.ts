import { PostData } from '@subsocial/api/types'
import { ComponentProps } from 'react'

export type ChatItemContentProps = ComponentProps<'div'> & {
  chatId: string
  hubId: string
  message: PostData
  isMyMessage: boolean
  scrollToMessage?: (messageId: string) => Promise<void>
}
