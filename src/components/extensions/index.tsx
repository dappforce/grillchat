import DonateModal from './donate/DonateModal/DonateModal'
import ImageAttachmentModal from './image/ImageAttachmentModal'
import NftAttachmentModal from './nft/NftAttachmentModal'

export type ExtensionModalsProps = {
  chatId: string
  onSubmit: () => void
}

export default function ExtensionModals({ ...props }: ExtensionModalsProps) {
  return (
    <>
      <NftAttachmentModal {...props} />
      <ImageAttachmentModal {...props} />
      <DonateModal {...props} />
    </>
  )
}
