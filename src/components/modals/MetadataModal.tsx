import { CopyTextInline } from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'

export type MetadataModalProps = ModalFunctionalityProps & {
  post: PostData
  postIdTextPrefix?: string
}

export default function MetadataModal({
  post,
  postIdTextPrefix = 'Post',
  ...props
}: MetadataModalProps) {
  return (
    <Modal {...props} title='Metadata'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-sm text-text-muted')}>
            {postIdTextPrefix} ID:
          </span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={post.id}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-sm text-text-muted')}>Content ID:</span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={post.struct.contentId ?? ''}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-sm text-text-muted')}>Owner:</span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={post.struct.ownerId}
          />
        </div>
      </div>
    </Modal>
  )
}
