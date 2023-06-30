import { useExtensionData } from '@/stores/extension'
import { getUrlFromText } from '@/utils/strings'
import { PostContentExtension } from '@subsocial/api/types'
import { ClipboardEvent } from 'react'
import DonateMessagePreview from './donate/DonateMessagePreview'
import DonateRepliedMessagePreviewPart from './donate/DonateRepliedMessagePreviewPart'
import ImageChatItem from './image/ImageChatItem'
import ImageRepliedMessagePreviewPart from './image/ImageRepliedMessagePreviewPart'
import { SUPPORTED_IMAGE_EXTENSIONS } from './image/utils'
import NftChatItem from './nft/NftChatItem'
import NftRepliedMessagePreviewPart from './nft/NftRepliedMessagePreviewPart'
import { parseNftMarketplaceLink } from './nft/utils'
import SecretBoxChatItem from './secret-box/SecretBoxChatItem'
import SecretBoxMessagePreviewPart from './secret-box/SecretBoxMessagePreviewPart'
import {
  ExtensionChatItemProps,
  RepliedMessagePreviewPartsProps,
} from './types'

export const extensionInitialDataTypes = {
  'subsocial-donations': { recipient: '', messageId: '' },
  'subsocial-evm-nft': null as null | string,
  'subsocial-image': null as null | File | string,
  'subsocial-decoded-promo': { recipient: '', messageId: '' },
} satisfies Record<PostContentExtension['id'], unknown>

type Config<Id extends PostContentExtension['id']> = {
  chatItemComponent: (props: ExtensionChatItemProps) => JSX.Element | null
  replyMessageUI: RepliedMessagePreviewPartsProps
  pasteInterception?: (
    clipboardData: DataTransfer,
    e: ClipboardEvent<HTMLTextAreaElement>
  ) => (typeof extensionInitialDataTypes)[Id]
}
const extensionsConfig: {
  [key in PostContentExtension['id']]: Config<key>
} = {
  'subsocial-donations': {
    chatItemComponent: DonateMessagePreview,
    replyMessageUI: {
      element: DonateRepliedMessagePreviewPart,
      config: { place: 'body', textColor: '#FCEEE2' },
    },
  },
  'subsocial-evm-nft': {
    chatItemComponent: NftChatItem,
    replyMessageUI: {
      element: NftRepliedMessagePreviewPart,
      config: {
        place: 'inside',
        emptyBodyText: 'NFT',
        previewClassName: 'w-4',
      },
    },
    pasteInterception: (clipboardData, e) => {
      const text = clipboardData.getData('text/plain')
      try {
        const marketplace = parseNftMarketplaceLink(text)
        e.preventDefault()
        return marketplace.url
      } catch {}

      return null
    },
  },
  'subsocial-image': {
    chatItemComponent: ImageChatItem,
    replyMessageUI: {
      element: ImageRepliedMessagePreviewPart,
      config: {
        place: 'inside',
        emptyBodyText: 'Image',
        previewClassName: 'w-4',
      },
    },
    pasteInterception: (clipboardData, e) => {
      const files = clipboardData.files
      const file = files[0]
      if (file?.type.startsWith('image/')) {
        return file
      }

      const text = clipboardData.getData('text/plain')
      const url = getUrlFromText(text)
      const urlWithoutQuery = url?.split('?')[0]
      const extension = urlWithoutQuery?.split('.').pop()
      if (
        url &&
        SUPPORTED_IMAGE_EXTENSIONS.includes(
          `.${extension?.toLowerCase() ?? ''}`
        )
      ) {
        e.preventDefault()
        return url
      }

      return null
    },
  },
  'subsocial-decoded-promo': {
    chatItemComponent: SecretBoxChatItem,
    replyMessageUI: {
      // TODO: SECRET BOX: Update this to use secret box preview
      element: SecretBoxMessagePreviewPart,
      config: {
        place: 'body',
        previewClassName: 'w-4',
      },
    },
  },
}

export function getExtensionConfig<Id extends PostContentExtension['id']>(
  // type to make it can accept any string, but still have the autocomplete
  extensionId: Id | (string & {})
): Config<Id> | null {
  return extensionsConfig[extensionId as Id]
}

export function interceptPastedData(
  clipboardData: DataTransfer,
  e: ClipboardEvent<HTMLTextAreaElement>
) {
  const pasteChecker = Object.entries(extensionsConfig)

  for (let i = 0; i < pasteChecker.length; i++) {
    const [key, config] = pasteChecker[i]

    const { pasteInterception } = config
    const result = pasteInterception?.(clipboardData, e)

    if (result) {
      useExtensionData
        .getState()
        .openExtensionModal(key as PostContentExtension['id'], result)
      break
    }
  }
}
