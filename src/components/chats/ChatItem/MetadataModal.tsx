import { CopyTextInline } from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'

export type MetadataModalProps = ModalFunctionalityProps & {
  comment: PostData
}

export default function MetadataModal({
  comment,
  ...props
}: MetadataModalProps) {
  return (
    <Modal {...props} title='Metadata'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-text-muted')}>Post ID:</span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={comment.id}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-text-muted')}>Owner:</span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={comment.struct.ownerId}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <span className={cx('text-text-muted')}>Content ID:</span>
          <CopyTextInline
            className='max-w-full whitespace-pre-wrap break-words'
            textClassName={cx('max-w-[calc(100%_-_2rem)]')}
            text={comment.struct.contentId ?? ''}
          />
        </div>
      </div>
    </Modal>
  )
}
