import { useExtensionData } from '@/stores/extension'
import { getUrlFromText } from '@/utils/strings'
import { PostContentExtension } from '@subsocial/api/types'
import dynamic from 'next/dynamic'
import { ClipboardEvent, ComponentType } from 'react'
import { SUPPORTED_IMAGE_EXTENSIONS } from './image/utils'
import { parseNftMarketplaceLink } from './nft/utils'
import {
  ExtensionChatItemProps,
  RepliedMessagePreviewPartsProps,
} from './types'

const SecretBoxChatItem = dynamic(
  () => import('./secret-box/SecretBoxChatItem')
)
const SecretBoxMessagePreviewPart = dynamic(
  () => import('./secret-box/SecretBoxMessagePreviewPart')
)

const DonateMessagePreview = dynamic(
  () => import('./donate/DonateMessagePreview')
)
const DonateRepliedMessagePreviewPart = dynamic(
  () => import('./donate/DonateRepliedMessagePreviewPart')
)

const ImageChatItem = dynamic(() => import('./image/ImageChatItem'))
const ImageRepliedMessagePreviewPart = dynamic(
  () => import('./image/ImageRepliedMessagePreviewPart')
)

const NftChatItem = dynamic(() => import('./nft/NftChatItem'))
const NftRepliedMessagePreviewPart = dynamic(
  () => import('./nft/NftRepliedMessagePreviewPart')
)

export const extensionInitialDataTypes = {
  'subsocial-donations': { recipient: '', messageId: '' },
  'subsocial-evm-nft': null as null | string,
  'subsocial-image': null as null | File | string,
  'subsocial-decoded-promo': { recipient: '', messageId: '' },
} satisfies Record<PostContentExtension['id'], unknown>

type Config<Id extends PostContentExtension['id']> = {
  chatItemComponent: ComponentType<ExtensionChatItemProps>
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
      config: { place: 'body' },
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
