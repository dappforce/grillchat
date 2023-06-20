import { PostContent, PostData } from '@subsocial/api/types'

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

export type RepliedMessagePreviewPatrsProps = {
  element: (props: RepliedMessagePreviewPartProps) => JSX.Element | null
  config: RepliedMessageConfig
}
