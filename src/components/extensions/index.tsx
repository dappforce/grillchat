import dynamic from 'next/dynamic'

const ImageModal = dynamic(() => import('./image/ImageModal'), {
  ssr: false,
})
const NftModal = dynamic(() => import('./nft/NftModal'), {
  ssr: false,
})
const SecretBoxModal = dynamic(() => import('./secret-box/SecretBoxModal'), {
  ssr: false,
})

export type ExtensionModalsProps = {
  hubId: string
  chatId: string
  onSubmit: () => void
}

export default function ExtensionModals({ ...props }: ExtensionModalsProps) {
  return (
    <>
      <NftModal {...props} />
      <ImageModal {...props} />
      <SecretBoxModal {...props} />
    </>
  )
}
