import Shield from '@/assets/icons/shield.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import Notice from '@/components/Notice'
import ChatRoom from '@/components/chats/ChatRoom'
import usePinnedMessage from '@/components/chats/hooks/usePinnedMessage'
import Meme2EarnIntroModal, {
  hasOpenedMeme2EarnIntroStorage,
} from '@/components/modals/Meme2EarnIntroModal'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import PointsWidget from '@/modules/points/PointsWidget'
import { getPostQuery } from '@/services/api/query'
import { getTokenomicsMetadataQuery } from '@/services/datahub/content-staking/query'
import { getBalanceQuery } from '@/services/datahub/leaderboard/points-balance/query'
import { getTimeLeftUntilCanPostQuery } from '@/services/datahub/posts/query'
import { useSendEvent } from '@/stores/analytics'
import { useExtensionData } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'
import { LuPlusCircle } from 'react-icons/lu'

dayjs.extend(duration)

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

function countdownText(timeLeft: number) {
  const timeDuration = dayjs.duration({ milliseconds: timeLeft })
  const minutes = Math.floor(timeDuration.asMinutes())
  const seconds = Math.floor(timeDuration.asSeconds()) - minutes * 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}
function PostMemeButton() {
  const sendEvent = useSendEvent()
  const [isOpenIntroModal, setIsOpenIntroModal] = useState(false)
  const openExtensionModal = useExtensionData.use.openExtensionModal()

  const myAddress = useMyMainAddress() ?? ''
  const { data, isLoading } = getBalanceQuery.useQuery(myAddress)
  const { data: timeLeftFromApi, isLoading: loadingTimeLeft } =
    getTimeLeftUntilCanPostQuery.useQuery(myAddress)
  const { data: tokenomics, isLoading: loadingTokenomics } =
    getTokenomicsMetadataQuery.useQuery(null)

  const [timeLeft, setTimeLeft] = useState<number>(Infinity)
  useEffect(() => {
    if (typeof timeLeftFromApi === 'number') {
      setTimeLeft(Math.max(timeLeftFromApi, 0))
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = Math.max(prev - 1000, 0)
          if (next === 0) clearInterval(interval)
          return next
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timeLeftFromApi])

  const isMoreThanThreshold =
    !isLoading &&
    !loadingTokenomics &&
    data &&
    data >=
      parseInt(
        tokenomics?.socialActionBalanceThreshold.createCommentPoints ?? '0'
      )
  const isTimeConstrained =
    !loadingTimeLeft && timeLeft !== Infinity && (timeLeft ?? 0) > 0

  return (
    <>
      <Button
        disabled={
          isLoading || loadingTokenomics || loadingTimeLeft || isTimeConstrained
        }
        type='button'
        className='flex items-center justify-center gap-2 px-0 disabled:border-none disabled:bg-background-light/30 disabled:text-text-muted/50 disabled:!brightness-100'
        size='lg'
        variant={isMoreThanThreshold ? 'primary' : 'primaryOutline'}
        onClick={() => {
          if (isMoreThanThreshold) {
            if (hasOpenedMeme2EarnIntroStorage.get() !== 'true') {
              sendEvent('meme2earn_intro_modal_opened')
              setIsOpenIntroModal(true)
              hasOpenedMeme2EarnIntroStorage.set('true')
              return
            }
            openExtensionModal('subsocial-image', null)
          } else {
            useMessageData.getState().setOpenMessageModal('not-enough-balance')
          }
        }}
      >
        {!isTimeConstrained ? (
          <>
            <LuPlusCircle className='relative top-px text-lg' />
            <span>Post Meme</span>
          </>
        ) : (
          <>
            {/* <FaRegClock className='relative top-px text-lg' /> */}
            <span>Posting available in: {countdownText(timeLeft)}</span>
          </>
        )}
      </Button>
      <Meme2EarnIntroModal
        isOpen={isOpenIntroModal}
        closeModal={() => {
          sendEvent('meme2earn_intro_modal_closed')
          setIsOpenIntroModal(false)
        }}
      />
    </>
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
