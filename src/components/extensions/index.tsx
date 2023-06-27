import DonateModal from './donate/DonateModal/DonateModal'
import ImageModal from './image/ImageModal'
import NftModal from './nft/NftModal'

export type ExtensionModalsProps = {
  chatId: string
  onSubmit: () => void
}

export default function ExtensionModals({ ...props }: ExtensionModalsProps) {
  return (
    <>
      <NftModal {...props} />
      <ImageModal {...props} />
      <DonateModal {...props} />
    </>
  )
}
