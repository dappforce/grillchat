import Input from '@/components/inputs/Input'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useState } from 'react'
import CommonExtensionModal from '../CommonExtensionModal'

export type NftAttachmentModalProps = ModalFunctionalityProps

export default function NftAttachmentModal({
  ...props
}: NftAttachmentModalProps) {
  const [nftLink, setNftLink] = useState('')
  const [nftLinkError, setNftLinkError] = useState('')

  return (
    <CommonExtensionModal
      {...props}
      formProps={{
        chatId: '1001',
        sendButtonProps: {
          disabled: !nftLink || !!nftLinkError,
        },
      }}
      title='🖼 Attach NFT'
      description='Should be a link to an NFT page from any popular marketplace, such as Opensea, Rarible or another'
    >
      <Input
        placeholder='Paste NFT URL'
        value={nftLink}
        onChange={(e) => setNftLink(e.target.value)}
      />
    </CommonExtensionModal>
  )
}
