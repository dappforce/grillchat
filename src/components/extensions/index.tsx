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

export default function ExtensionModals({ ...props }: ExtensionModalsProps) {
  return (
    <>
      <NftModal {...props} />
      <ImageModal {...props} />
      <DonateModal {...props} />
    </>
  )
}
