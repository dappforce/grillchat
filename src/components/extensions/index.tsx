import dynamic from 'next/dynamic'

const DonateModal = dynamic(() => import('./donate/DonateModal/DonateModal'), {
  ssr: false,
})
const ImageModal = dynamic(() => import('./image/ImageModal'), {
  ssr: false,
})
const NftModal = dynamic(() => import('./nft/NftModal'), {
  ssr: false,
})

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
