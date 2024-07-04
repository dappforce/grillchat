import Diamond from '@/assets/emojis/diamond.png'
import Pointup from '@/assets/emojis/pointup.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import { env } from '@/env.mjs'
import usePostMemeThreshold from '@/hooks/usePostMemeThreshold'
import { formatNumber } from '@/utils/strings'
import Image from 'next/image'
import Button from '../Button'
import Modal, { ModalFunctionalityProps } from './Modal'

export default function PostMemeThresholdModal({
  chatId,
  ...props
}: ModalFunctionalityProps & { chatId: string }) {
  const { threshold } = usePostMemeThreshold(chatId)
  const thresholdPoints = formatNumber(
    threshold?.thresholdPointsAmount ?? '0',
    { shorten: true }
  )

  const isContest = chatId === env.NEXT_PUBLIC_CONTEST_CHAT_ID

  return (
    <Modal
      {...props}
      title={`Reach ${thresholdPoints} points to post${
        isContest ? ' in contest' : ''
      }`}
      titleClassName='font-medium'
      withCloseButton
      closeModal={() => undefined}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-background-lighter p-4'>
          <span className='text-center font-medium text-text-muted'>
            To post your own memes{isContest ? ' in this contest' : ''}, you
            need to reach:
          </span>
          <div className='-ml-2 flex items-center gap-2.5'>
            <Image src={Diamond} alt='' className='h-12 w-12' />
            <span className='flex items-center text-3xl font-bold'>
              {thresholdPoints} points
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-4 text-text-muted'>
          <div className='flex items-center gap-3'>
            <span className='text-xl font-medium text-text-muted'>
              You can easily get points by:
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Image src={Thumbsup} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Liking fun memes from other users.
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Image src={Pointup} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Tapping on meme cat.
            </span>
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
