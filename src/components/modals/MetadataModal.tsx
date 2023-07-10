import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import { getIpfsContentUrl, getSubIdUrl } from '@/utils/ipfs'
import { getPolkadotJsUrl } from '@/utils/links'
import { PostData, SpaceData } from '@subsocial/api/types'
import DataCard, { DataCardProps } from '../DataCard'

export type MetadataModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick'> & {
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
      textToCopy: entity.id,
      redirectTo: entity.struct.createdAtBlock
        ? getPolkadotJsUrl(`/explorer/query/${entity.struct.createdAtBlock}`)
        : undefined,
      openInNewTab: true,
    },
    {
      title: 'Content ID:',
      content: entity.struct.contentId ?? '',
      redirectTo: getIpfsContentUrl(entity.struct.contentId ?? ''),
      openInNewTab: true,
      textToCopy: entity.struct.contentId ?? '',
    },
    {
      title: 'Owner:',
      content: entity.struct.ownerId ?? '',
      redirectTo: getSubIdUrl(entity.struct.ownerId ?? ''),
      openInNewTab: true,
      textToCopy: entity.struct.ownerId ?? '',
    },
  ]

  return (
    <Modal {...props} title='Metadata' withCloseButton>
      <DataCard data={metadataList} />
    </Modal>
  )
}
