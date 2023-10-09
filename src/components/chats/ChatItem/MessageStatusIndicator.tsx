import Button from '@/components/Button'
import { isOptimisticId } from '@/services/datahub/posts/utils'
import { commentIdsOptimisticEncoder } from '@/services/subsocial/commentIds/optimistic'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { SyntheticEvent, useReducer } from 'react'
import { BsExclamationLg } from 'react-icons/bs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import CheckMarkExplanationModal, {
  CheckMarkModalVariant,
} from './CheckMarkExplanationModal'

export type MessageStatus =
  | 'sending'
  | 'datahub'
  | 'blockchain'
  | 'blockchain-failed'

export type MessageStatusIndicatorProps = {
  message: PostData
}

type CheckMarkModalReducerState = {
  isOpen: boolean
  variant: CheckMarkModalVariant | ''
}
const checkMarkModalReducer = (
  state: CheckMarkModalReducerState,
  action: CheckMarkModalVariant | ''
): CheckMarkModalReducerState => {
  if (action === '') {
    return { ...state, isOpen: false }
  }
  return { isOpen: true, variant: action }
}

export default function MessageStatusIndicator({
  message,
}: MessageStatusIndicatorProps) {
  const messageStatus = getMessageStatusById(message.id)
  const sendEvent = useSendEvent()
  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })

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

  const onCheckMarkClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    const checkMarkType: CheckMarkModalVariant = checkMarkModalState
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

  return (
    <Button
      variant='transparent'
      size='noPadding'
      interactive='brightness-only'
      onClick={onCheckMarkClick}
    >
      {messageStatus === 'sending' ? (
        <IoCheckmarkOutline
          className={cx(
            'text-sm text-text-muted dark:text-text-muted-on-primary'
          )}
        />
      ) : (
        <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
      )}

      <CheckMarkExplanationModal
        isOpen={checkMarkModalState.isOpen}
        variant={checkMarkModalState.variant || 'recording'}
        closeModal={() => dispatch('')}
        blockNumber={message.struct.createdAtBlock}
        cid={message.struct.contentId}
      />
    </Button>
  )
}

export function getMessageStatusById(id: string): MessageStatus {
  if (isOptimisticId(id)) {
    if (commentIdsOptimisticEncoder.checker(id)) return 'sending'
    return 'datahub'
  } else {
    return 'blockchain'
  }
}
