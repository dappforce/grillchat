import Button from '@/components/Button'
import Spinner from '@/components/Spinner'
import Toast from '@/components/Toast'
import Modal from '@/components/modals/Modal'
import useRerender from '@/hooks/useRerender'
import { ResendFailedMessageWrapper } from '@/services/subsocial/commentIds/mutation'
import {
  isClientGeneratedOptimisticId,
  isMessageSent,
} from '@/services/subsocial/commentIds/optimistic'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { estimatedWaitTime } from '@/utils/network'
import { PostData } from '@subsocial/api/types'
import { SyntheticEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BsExclamationLg } from 'react-icons/bs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import CheckMarkExplanationModal from './CheckMarkExplanationModal'

export type MessageStatus = 'sending' | 'offChain' | 'optimistic' | 'blockchain'

export type MessageStatusIndicatorProps = {
  message: PostData
}

export default function MessageStatusIndicator({
  message,
}: MessageStatusIndicatorProps) {
  const sendEvent = useSendEvent()
  const [isOpenCheckmarkModal, setIsOpenCheckmarkModal] = useState(false)
  const isFailedOptimisticMessage = useIsFailedOptimisticMessage(message)
  const [isAfterResending, setIsAfterResending] = useState(false)

  const messageStatus = getMessageStatusById(message)

  if (message.struct.dataType === 'offChain' || isFailedOptimisticMessage) {
    if (isAfterResending) {
      return <Spinner className='h-2.5 w-2.5' />
    }

    return (
      <ResendMessageIndicator
        message={message}
        onSuccess={() => setIsAfterResending(true)}
      />
    )
  }

  const onCheckMarkClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    sendEvent('click check_mark_button', { type: messageStatus })
    setIsOpenCheckmarkModal(true)
  }

  return (
    <Button
      variant='transparent'
      size='noPadding'
      interactive='brightness-only'
      onClick={onCheckMarkClick}
    >
      {(() => {
        if (messageStatus === 'sending') {
          return (
            <IoCheckmarkOutline
              className={cx('text-sm text-text-muted-on-primary-light')}
            />
          )
        } else if (messageStatus === 'blockchain') {
          return (
            <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
          )
        } else if (messageStatus === 'optimistic') {
          return (
            <IoCheckmarkDoneOutline className='text-sm dark:text-text-on-primary' />
          )
        } else if (messageStatus === 'offChain') {
          return (
            <IoCheckmarkDoneOutline className='text-sm text-blue-600 dark:text-blue-300' />
          )
        }
      })()}

      <CheckMarkExplanationModal
        isOpen={isOpenCheckmarkModal}
        variant={messageStatus}
        closeModal={() => setIsOpenCheckmarkModal(false)}
        blockNumber={message.struct.createdAtBlock}
        cid={message.struct.contentId}
      />
    </Button>
  )
}

export function getMessageStatusById(message: PostData): MessageStatus {
  const id = message.id
  if (!isMessageSent(id, message.struct.dataType)) {
    if (isClientGeneratedOptimisticId(id)) return 'sending'
    return 'optimistic'
  } else {
    if (message.struct.dataType === 'offChain') return 'offChain'
    return 'blockchain'
  }
}

function ResendMessageIndicator({
  message,
  onSuccess,
}: MessageStatusIndicatorProps & { onSuccess: () => void }) {
  const [isResendOpen, setIsResendOpen] = useState(false)
  const sendEvent = useSendEvent()

  return (
    <>
      <Button
        className='rounded-full bg-text-warning/40 text-text-warning'
        variant='transparent'
        size='noPadding'
        onClick={() => {
          sendEvent('click message_failed_status_button')
          setIsResendOpen(true)
        }}
      >
        <BsExclamationLg className={cx('block text-sm')} />
      </Button>
      <Modal
        isOpen={isResendOpen}
        closeModal={() => setIsResendOpen(false)}
        title='Blockchain backup failed'
        description="Don't worry, your message sent, but it was not saved on the blockchain. You can try to save it again."
        withCloseButton
      >
        <ResendFailedMessageWrapper>
          {({ isLoading, mutateAsync }) => {
            return (
              <Button
                size='lg'
                isLoading={isLoading}
                onClick={async () => {
                  if (!message.content) return
                  sendEvent('click resend_message_button')
                  await mutateAsync({
                    chatId: message.struct.rootPostId,
                    content: message.content,
                  })
                  toast.custom((t) => (
                    <Toast
                      title='Successfully resent your message!'
                      description={`Your message will be available on blockchain in about ${estimatedWaitTime} seconds`}
                      type='default'
                      t={t}
                    />
                  ))
                  onSuccess()
                }}
              >
                Resend Message
              </Button>
            )
          }}
        </ResendFailedMessageWrapper>
      </Modal>
    </>
  )
}

function useIsFailedOptimisticMessage(message: PostData) {
  const rerender = useRerender()
  const isMoreThan1Mins =
    Date.now() - new Date(message.struct.createdAtTime).getTime() > 60 * 1000

  useEffect(() => {
    if (!isMoreThan1Mins) {
      const intervalId = setTimeout(() => {
        rerender()
      }, 60 * 1000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [isMoreThan1Mins, rerender])

  return message.struct.dataType === 'optimistic' && isMoreThan1Mins
}
