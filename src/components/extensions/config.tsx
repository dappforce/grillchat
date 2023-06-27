import { useExtensionData } from '@/stores/extension'
import { PostContentExtension } from '@subsocial/api/types'
import { ClipboardEvent } from 'react'
import DonateMessagePreview from './donate/DonateMessagePreview'
import DonateRepliedMessagePreviewPart from './donate/DonateRepliedMessagePreviewPart'
import NftChatItem from './nft/NftChatItem'
import NftRepliedMessagePreviewPart from './nft/NftRepliedMessagePreviewPart'
import { parseNftMarketplaceLink } from './nft/utils'
import {
  ChatItemWithExtensionProps,
  RepliedMessagePreviewPartsProps,
} from './types'

export const repliedMessagePreviewParts: Record<
  PostContentExtension['id'],
  RepliedMessagePreviewPartsProps
> = {
  'subsocial-image': {
    element: NftRepliedMessagePreviewPart,
    config: {
      place: 'inside',
      emptyBodyText: 'Image',
      previewClassName: 'w-4',
    },
  },
  'subsocial-evm-nft': {
    element: NftRepliedMessagePreviewPart,
    config: { place: 'inside', emptyBodyText: 'NFT', previewClassName: 'w-4' },
  },
  'subsocial-donations': {
    element: DonateRepliedMessagePreviewPart,
    config: { place: 'body', textColor: '#FCEEE2' },
  },
}

export const chatItemByExtensionId: Record<
  PostContentExtension['id'],
  (props: ChatItemWithExtensionProps) => JSX.Element
> = {
  'subsocial-image': NftChatItem,
  'subsocial-donations': DonateMessagePreview,
  'subsocial-evm-nft': NftChatItem,
}

export const extensionModalStates = {
  'subsocial-image': null as null | File,
  'subsocial-evm-nft': null as null | string,
  'subsocial-donations': { recipient: '', messageId: '' },
} satisfies { [key in PostContentExtension['id']]: unknown }

const pasteInterception = {
  'subsocial-evm-nft': (clipboardData, e) => {
    const text = clipboardData.getData('text/plain')
    try {
      const marketplace = parseNftMarketplaceLink(text)
      e.preventDefault()
      return marketplace.url
    } catch {}

    return null
  },
  'subsocial-image': (clipboardData, _) => {
    const files = clipboardData.files
    const file = files[0]
    if (file?.type.startsWith('image/')) {
      return file
    }
    return null
  },
} satisfies {
  [key in PostContentExtension['id']]?: (
    clipboardData: DataTransfer,
    e: ClipboardEvent<HTMLTextAreaElement>
  ) => (typeof extensionModalStates)[key]
}

export function interceptPastedData(
  clipboardData: DataTransfer,
  e: ClipboardEvent<HTMLTextAreaElement>
) {
  const pasteChecker = Object.entries(pasteInterception)
  for (let i = 0; i < pasteChecker.length; i++) {
    const [key, checker] = pasteChecker[i]
    const result = checker(clipboardData, e)
    if (result) {
      useExtensionData
        .getState()
        .openExtensionModal(key as PostContentExtension['id'], result)
      break
    }
  }
}
