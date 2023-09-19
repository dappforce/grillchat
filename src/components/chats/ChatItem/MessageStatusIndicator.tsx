import { isOptimisticId } from '@/services/datahub/posts/utils'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { cx } from '@/utils/class-names'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

export type MessageStatus = 'sending' | 'datahub' | 'blockchain'

export type MessageStatusIndicatorProps = {
  messageId: string
}

export default function MessageStatusIndicator({
  messageId,
}: MessageStatusIndicatorProps) {
  const messageStatus = getMessageStatusById(messageId)

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
