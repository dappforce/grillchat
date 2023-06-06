import Input from '@/components/inputs/Input'
import { ModalFunctionalityProps } from '@/components/modals/Modal'
import CommonExtensionModal from '../CommonExtensionModal'

export type NftAttachmentModalProps = ModalFunctionalityProps

export default function NftAttachmentModal({
  ...props
}: NftAttachmentModalProps) {
  return (
    <CommonExtensionModal
      {...props}
      chatId=''
      title='🖼 Attach NFT'
      description='Should be a link to an NFT page from any popular marketplace, such as Opensea, Rarible or another'
      // sendButtonText='Send 50 ETH'
    >
      <Input placeholder='Paste NFT URL' />
    </CommonExtensionModal>
  )
}
