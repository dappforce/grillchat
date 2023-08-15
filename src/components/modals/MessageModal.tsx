import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { CommentData } from '@subsocial/api/types'
import { useRef, useState } from 'react'
import LoginModal from '../auth/LoginModal'
import Button from '../Button'
import Card from '../Card'
import ChatItem from '../chats/ChatItem'
import ProfilePreview from '../ProfilePreview'
import Modal, { ModalFunctionalityProps } from './Modal'

export type MessageModalProps = ModalFunctionalityProps & {
  messageId: string
  scrollToMessage?: (messageId: string) => Promise<void>
  hubId: string
  recipient: string
}

export default function MessageModal({
  messageId,
  scrollToMessage,
  hubId,
  recipient,
  ...props
}: MessageModalProps) {
  const myAddress = useMyAccount((state) => state.address)
  const isDifferentRecipient = recipient !== myAddress

  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)

  const { data: message } = getPostQuery.useQuery(messageId)
  const chatId = (message as unknown as CommentData)?.struct.rootPostId
  const { data: chat } = getPostQuery.useQuery(chatId)

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [isScrolling, setIsScrolling] = useState(false)

  const chatTitle = chat?.content?.title || (
    <span className='ml-2 inline-block h-[1.3em] w-28 animate-pulse rounded-lg bg-background' />
  )

  const handleScrollToMessage = async () => {
    if (!scrollToMessage) return

    setIsScrolling(true)
    await scrollToMessage(messageId)
    setIsScrolling(false)

    props.closeModal()
  }

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isOpenLoginModal}
        initialFocus={buttonRef}
        title={
          <span className='flex items-center'>Message from {chatTitle}</span>
        }
      >
        <div
          className={cx(
            'flex max-h-96 flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-4',
            !message && 'h-28 animate-pulse'
          )}
        >
          {message && (
            <ChatItem
              enableChatMenu={false}
              isMyMessage={false}
              message={message}
              chatId={chatId}
              hubId={hubId}
            />
          )}
          {scrollToMessage && (
            <Button
              ref={buttonRef}
              isLoading={isScrolling}
              onClick={handleScrollToMessage}
              size='lg'
              variant='primaryOutline'
            >
              Scroll to message
            </Button>
          )}
        </div>
        {isDifferentRecipient && (
          <Card className='mt-4 bg-background-lighter'>
            <span className='text-sm text-text-muted'>
              Notification recipient
            </span>
            <ProfilePreview
              className='mt-3'
              address={recipient}
              avatarClassName='h-12 w-12'
              showMaxOneAddress
            />
            <Button
              size='lg'
              className='mt-4 w-full'
              onClick={() => setIsOpenLoginModal(true)}
            >
              Log In
            </Button>
          </Card>
        )}
      </Modal>
      <LoginModal
        isOpen={isOpenLoginModal}
        closeModal={() => setIsOpenLoginModal(false)}
        initialOpenState='enter-secret-key'
        onBackClick={() => setIsOpenLoginModal(false)}
      />
    </>
  )
}
