import { PostData } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { ScrollToMessage } from '../../ChatList/hooks/useScrollToMessage'

export type ChatItemContentProps = ComponentProps<'div'> & {
  chatId: string
  hubId: string
  message: PostData
  isMyMessage: boolean
  scrollToMessage?: ScrollToMessage
}
