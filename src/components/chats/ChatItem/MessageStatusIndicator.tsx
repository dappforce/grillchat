import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { PostData } from '@subsocial/api/types'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

export type MessageStatus = 'sending' | 'offChain' | 'optimistic' | 'blockchain'

export type MessageStatusIndicatorProps = {
  message: PostData
}

export default function MessageStatusIndicator({
  message,
}: MessageStatusIndicatorProps) {
  const sendEvent = useSendEvent()
  // const [isOpenCheckmarkModal, setIsOpenCheckmarkModal] = useState(false)

  const messageStatus = getMessageStatusById(message)

  // const onCheckMarkClick = (e: SyntheticEvent) => {
  //   e.stopPropagation()
  //   sendEvent('click check_mark_button', { type: messageStatus })
  //   setIsOpenCheckmarkModal(true)
  // }

  return (
    <span>
      {(() => {
        if (!message.struct.dataType) {
          return (
            <IoCheckmarkOutline
              className={cx('text-sm text-text-muted-on-primary-light')}
            />
          )
        } else if (messageStatus === 'offChain') {
          return (
            <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
          )
        }
      })()}

      {/* <CheckMarkExplanationModal
        isOpen={isOpenCheckmarkModal}
        variant={messageStatus}
        closeModal={() => setIsOpenCheckmarkModal(false)}
        blockNumber={message.struct.createdAtBlock}
        cid={message.struct.contentId}
      /> */}
    </span>
  )
}

export function getMessageStatusById(message: PostData): MessageStatus {
  if (!message.struct.dataType) {
    return 'sending'
  } else {
    return 'offChain'
  }
}
