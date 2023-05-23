import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getIpfsContentUrl, getSubIdUrl } from '@/utils/ipfs'
import { PostData } from '@subsocial/api/types'
import DataCard, { DataCardProps } from '../DataCard'

export type MetadataModalProps = ModalFunctionalityProps & {
  post: PostData
  postIdTextPrefix?: string
}

export default function MetadataModal({
  post,
  postIdTextPrefix = 'Post',
  ...props
}: MetadataModalProps) {
  const metadataList: DataCardProps['data'] = [
    {
      title: `${postIdTextPrefix} ID:`,
      content: post.id,
      withCopyButton: true,
    },
    {
      title: 'Content ID:',
      content: post.struct.contentId ?? '',
      redirectTo: getIpfsContentUrl(post.struct.contentId ?? ''),
      openInNewTab: true,
      withCopyButton: true,
    },
    {
      title: 'Owner:',
      content: post.struct.ownerId ?? '',
      redirectTo: getSubIdUrl(post.struct.ownerId ?? ''),
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
