import { PostContent, PostData } from '@subsocial/api/types'
import { ComponentType } from 'react'

export type ExtensionChatItemProps = {
  message: PostData
  isMyMessage?: boolean
  scrollToMessage?: (messageId: string) => Promise<void>
  chatId: string
  hubId: string
}

export type RepliedMessagePreviewPartProps = {
  extensions: PostContent['extensions']
  message?: PostData | null
  className?: string
}

export type RepliedMessageConfig = {
  place: 'inside' | 'body'
  emptyBodyText?: string
  textColor?: string
  previewClassName?: string
}

export type RepliedMessagePreviewPartsProps = {
  element: ComponentType<RepliedMessagePreviewPartProps>
  config: RepliedMessageConfig
}
