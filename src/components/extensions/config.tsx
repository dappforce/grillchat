import { useMessageData } from '@/stores/message'
import { PostContentExtension } from '@subsocial/api/types'
import { ClipboardEvent } from 'react'
import { parseNftMarketplaceLink } from './nft/utils'

export const extensionModalStates = {
  'subsocial-image': null as null | string,
  'subsocial-evm-nft': null as null | string,
} satisfies { [key in PostContentExtension['id']]: unknown }

const pasteInterception = {
  'subsocial-evm-nft': (clipboardData, _) => {
    const text = clipboardData.getData('text/plain')
    const marketplace = parseNftMarketplaceLink(text)

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
      useMessageData
        .getState()
        .openExtensionModal(key as PostContentExtension['id'], result)
      break
    }
  }
}
