import DonateModal from './donate/DonateModal/DonateModal'
import ImageModal from './image/ImageModal'
import NftModal from './nft/NftModal'
import SecretBoxModal from './secret-box/SecretBoxModal'

export type ExtensionModalsProps = {
  chatId: string
  onSubmit: () => void
}

const modalRegistry: ((props: ExtensionModalsProps) => JSX.Element)[] = [
  NftModal,
  ImageModal,
  DonateModal,
  SecretBoxModal,
]

export default function ExtensionModals({ ...props }: ExtensionModalsProps) {
  return (
    <>
      {modalRegistry.map((Modal, idx) => (
        <Modal {...props} key={idx} />
      ))}
    </>
  )
}
