import { PostContent, PostData } from '@subsocial/api/types'
import { SyntheticEvent } from 'react'

export type ExtensionChatItemProps = {
  message: PostData
  isMyMessage: boolean
  onCheckMarkClick: (e: SyntheticEvent) => void
  scrollToMessage?: (messageId: string) => Promise<void>
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
  element: (props: RepliedMessagePreviewPartProps) => JSX.Element | null
  config: RepliedMessageConfig
}
