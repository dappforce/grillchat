import Shield from '@/assets/icons/shield.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import ChatRoom from '@/components/chats/ChatRoom'
import usePinnedMessage from '@/components/chats/hooks/usePinnedMessage'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { POINTS_THRESHOLD } from '@/constants/chat-rules'
import PointsWidget from '@/modules/points/PointsWidget'
import { getPostQuery } from '@/services/api/query'
import { getBalanceQuery } from '@/services/datahub/leaderboard/points-balance/query'
import { useExtensionData } from '@/stores/extension'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatNumber } from '@/utils/strings'
import { useState } from 'react'
import { LuPlusCircle } from 'react-icons/lu'

type Props = {
  hubId: string
  chatId: string
  className?: string
}

export default function ChatContent({ chatId, hubId, className }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const pinnedMessageId = usePinnedMessage(chatId)
  const { data: message } = getPostQuery.useQuery(pinnedMessageId ?? '', {
    enabled: !!pinnedMessageId,
  })
  const hasPinnedMessage = !!message

  return (
    <>
      <RulesModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      />
      <ChatRoom
        topElement={
          <PointsWidget
            className={cx(
              'absolute left-0 top-0 z-10 w-full',
              hasPinnedMessage && 'top-14'
            )}
            isNoTgScroll
          />
        }
        scrollableContainerClassName='pt-12'
        asContainer
        chatId={chatId}
        hubId={hubId}
        className='overflow-hidden'
        customAction={
          <div className='grid grid-cols-[max-content_1fr] gap-2'>
            <Button
              type='button'
              size='lg'
              className='flex items-center justify-center gap-2'
              variant='bgLighter'
              onClick={() => setIsOpenModal(true)}
            >
              <Shield className='relative top-px text-text-muted' />
              <span className='text-text'>Rules</span>
            </Button>
            <PostMemeButton />
          </div>
        }
      />
    </>
  )
}
function PostMemeButton() {
  const openExtensionModal = useExtensionData.use.openExtensionModal()

  const myAddress = useMyMainAddress()
  const { data, isLoading } = getBalanceQuery.useQuery(myAddress || '')

  const hasThreshold = !isLoading && data && data >= POINTS_THRESHOLD

  let content = 'Loading...'
  if (!isLoading) {
    content = hasThreshold
      ? 'Post Meme'
      : `Hold ${formatNumber(POINTS_THRESHOLD)} points to post`
  }

  return (
    <Button
      disabled={isLoading || !hasThreshold}
      type='button'
      className='flex items-center justify-center gap-2'
      size='lg'
      onClick={() => {
        openExtensionModal('subsocial-image', null)
      }}
    >
      <LuPlusCircle className='relative top-px text-lg' />
      <span className='text-text'>{content}</span>
    </Button>
  )
}

function RulesModal(props: ModalFunctionalityProps) {
  return (
    <Modal {...props} title='Rules' withCloseButton>
      <div className='flex flex-col gap-6'>
        <ul className='flex list-none flex-col gap-3.5 text-text-muted'>
          <li>🤣 Post funny memes</li>
          <li>🌟 Be polite and respect others</li>
          <li>🚫 No sharing personal information</li>
          <li>🚫 No adult content</li>
          <li>🚫 No spam, no scam</li>
          <li>🚫 No violence</li>
        </ul>
        <Notice noticeType='warning' className='font-medium'>
          ⚠️ All those who break these rules will be banned and will lose all
          their points.
        </Notice>
        <LinkText
          variant='secondary'
          className='text-center'
          href='/legal/content-policy'
        >
          Read the detailed information
        </LinkText>
        <Button size='lg' onClick={() => props.closeModal()}>
          Got it!
        </Button>
      </div>
    </Modal>
  )
}
