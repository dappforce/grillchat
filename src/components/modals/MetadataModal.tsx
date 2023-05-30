import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getIpfsContentUrl, getSubIdUrl } from '@/utils/ipfs'
import { PostData, SpaceData } from '@subsocial/api/types'
import DataCard, { DataCardProps } from '../DataCard'

export type MetadataModalProps = ModalFunctionalityProps & {
  entity: PostData | SpaceData
  postIdTextPrefix?: string
}

export default function MetadataModal({
  entity,
  postIdTextPrefix = 'Post',
  ...props
}: MetadataModalProps) {
  const metadataList: DataCardProps['data'] = [
    {
      title: `${postIdTextPrefix} ID:`,
      content: entity.id,
      withCopyButton: true,
    },
    {
      title: 'Content ID:',
      content: entity.struct.contentId ?? '',
      redirectTo: getIpfsContentUrl(entity.struct.contentId ?? ''),
      openInNewTab: true,
      withCopyButton: true,
    },
    {
      title: 'Owner:',
      content: entity.struct.ownerId ?? '',
      redirectTo: getSubIdUrl(entity.struct.ownerId ?? ''),
      openInNewTab: true,
      withCopyButton: true,
    },
  ]

  return (
    <Modal {...props} title='Metadata' withCloseButton>
      <DataCard data={metadataList} />
    </Modal>
  )
}
