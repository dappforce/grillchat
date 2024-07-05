import Diamond from '@/assets/emojis/diamond.png'
import Laugh from '@/assets/emojis/laugh.png'
import Pointup from '@/assets/emojis/pointup.png'
import Speaker from '@/assets/emojis/speaker.png'
import Target from '@/assets/emojis/target.png'
import { env } from '@/env.mjs'
import usePostMemeThreshold from '@/hooks/usePostMemeThreshold'
import { useSendEvent } from '@/stores/analytics'
import { formatNumber } from '@/utils/strings'
import Image from 'next/image'
import Button from '../Button'
import LinkText from '../LinkText'
import Modal, { ModalFunctionalityProps } from './Modal'

export default function PostMemeThresholdModal({
  chatId,
  ...props
}: ModalFunctionalityProps & { chatId: string }) {
  const sendEvent = useSendEvent()
  const { threshold } = usePostMemeThreshold(chatId)
  const thresholdPoints = formatNumber(
    threshold?.thresholdPointsAmount ?? '0',
    { shorten: true }
  )

  const isContest = chatId === env.NEXT_PUBLIC_CONTEST_CHAT_ID

  return (
    <Modal
      {...props}
      title={`Earn more points to post${isContest ? ' in this contest' : ''}`}
      titleClassName='font-medium'
      withCloseButton
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-background-lighter p-4'>
          <span className='text-center font-medium text-text-muted'>
            Required amount:
          </span>
          <div className='-ml-2 flex items-center gap-2.5'>
            <Image src={Diamond} alt='' className='h-12 w-12' />
            <span className='flex items-center text-3xl font-bold'>
              {thresholdPoints} points
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-3 text-text-muted'>
          <div className='flex items-center gap-4'>
            <span className='font-medium text-text-muted'>
              You can easily get points by:
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <Image src={Target} className='h-10 w-10 flex-shrink-0' alt='' />
            <LinkText
              onClick={() => {
                sendEvent('post_meme_threshold_modal_complete_tasks')
                props.closeModal()
              }}
              href='/tg/tasks'
              variant='primary'
              className='-ml-2 font-medium'
            >
              Complete Tasks
            </LinkText>
          </div>
          <div className='flex items-center gap-4'>
            <Image src={Laugh} alt='' className='h-8 w-8 flex-shrink-0' />
            <LinkText
              onClick={() => {
                sendEvent('post_meme_threshold_modal_post_meme')
                props.closeModal()
              }}
              variant='primary'
              className='font-medium'
            >
              Post and like memes
            </LinkText>
          </div>
          <div className='flex items-center gap-4'>
            <Image src={Speaker} className='h-8 w-8 flex-shrink-0' alt='' />
            <LinkText
              onClick={() => {
                sendEvent('post_meme_threshold_modal_invite_friends')
                props.closeModal()
              }}
              variant='primary'
              href='/tg/friends'
              className='font-medium'
            >
              Invite your friends
            </LinkText>
          </div>
          <div className='flex items-center gap-4'>
            <Image src={Pointup} className='h-8 w-8 flex-shrink-0' alt='' />
            <LinkText
              onClick={() => {
                sendEvent('post_meme_threshold_modal_tap_emoji')
                props.closeModal()
              }}
              variant='primary'
              href='/tg/tap'
              className='font-medium'
            >
              Tap on the cat emoji
            </LinkText>
          </div>
        </div>
        <Button
          size='lg'
          onClick={() => {
            props.closeModal()
          }}
        >
          Got it!
        </Button>
      </div>
    </Modal>
  )
}
