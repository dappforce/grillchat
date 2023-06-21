import ImageAttachmentModal from './image/ImageAttachmentModal'
import NftAttachmentModal from './nft/NftAttachmentModal'

export type ExtensionModalsProps = {
  chatId: string
}

export default function ExtensionModals({ chatId }: ExtensionModalsProps) {
  return (
    <>
      <NftAttachmentModal chatId={chatId} />
      <ImageAttachmentModal chatId={chatId} />
    </>
  )
}
