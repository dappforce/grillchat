import Spinner from '@/components/Spinner'
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
  ...props
}: MessageStatusIndicatorProps) {
  const messageStatus = getMessageStatusById(messageId)

  if (messageStatus === 'sending') {
    return <Spinner className='h-2 w-2' />
  } else if (messageStatus === 'datahub') {
    return (
      <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
    )
  } else {
    return (
      <IoCheckmarkOutline
        className={cx(
          'text-sm text-text-muted dark:text-text-muted-on-primary'
        )}
      />
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
