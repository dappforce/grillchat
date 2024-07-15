import { PostContent, PostData } from '@subsocial/api/types'
import { ComponentType } from 'react'
import { SuperLikeButtonProps } from '../content-staking/SuperLike'

export type ExtensionChatItemProps = {
  message: PostData
  isMyMessage?: boolean
  scrollToMessage?: (messageId: string) => Promise<void>
  chatId: string
  disableSuperLike?: boolean
  hubId: string
  enableProfileModal?: boolean
  bg?: 'background' | 'background-light' | 'background-lighter'
  showApproveButton?: boolean
  className?: string
  dummySuperLike?: SuperLikeButtonProps
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
