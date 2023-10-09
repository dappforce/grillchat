import Button from '@/components/Button'
import { isOptimisticId } from '@/services/datahub/posts/utils'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { BsExclamationLg } from 'react-icons/bs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

export type MessageStatus =
  | 'sending'
  | 'datahub'
  | 'blockchain'
  | 'blockchain-failed'

export type MessageStatusIndicatorProps = {
  message: PostData
}

export default function MessageStatusIndicator({
  message,
}: MessageStatusIndicatorProps) {
  const messageStatus = getMessageStatusById(message.id)

  if (message.struct.blockchainSyncFailed) {
    return (
      <Button
        className='flex items-center rounded-full bg-text-warning/40 text-text-warning'
        variant='transparent'
        size='noPadding'
      >
        <BsExclamationLg className={cx('block text-sm')} />
      </Button>
    )
  }

  if (messageStatus === 'sending') {
    return (
      <IoCheckmarkOutline
        className={cx(
          'text-sm text-text-muted dark:text-text-muted-on-primary'
        )}
      />
    )
  } else {
    return (
      <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
    )
  }
}

export function getMessageStatusById(id: string): MessageStatus {
  if (isOptimisticId(id)) {
    if (commentIdsOptimisticEncoder.checker(id)) return 'sending'
    return 'datahub'
  } else {
    return 'blockchain'
  }
}
