import Diamond from '@/assets/emojis/diamond.png'
import Moneybag from '@/assets/emojis/moneybag.png'
import Pointup from '@/assets/emojis/pointup.png'
import Speaker from '@/assets/emojis/speaker.png'
import Thumbsup from '@/assets/emojis/thumbsup.png'
import { POINTS_THRESHOLD } from '@/constants/chat-rules'
import { formatNumber } from '@/utils/strings'
import Image from 'next/image'
import Button from '../Button'
import Modal, { ModalFunctionalityProps } from './Modal'

export default function PostMemeThresholdModal(props: ModalFunctionalityProps) {
  return (
    <Modal
      {...props}
      title={`Reach and hold ${formatNumber(POINTS_THRESHOLD)} points to post`}
      titleClassName='font-medium'
      closeModal={() => undefined}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-background-lighter p-4'>
          <span className='font-medium text-text-muted'>
            To post your own hilarious memes, you need to reach and hold
          </span>
          <div className='-ml-2 flex items-center gap-2.5'>
            <Image src={Diamond} alt='' className='h-12 w-12' />
            <span className='flex items-center text-4xl font-bold'>
              {formatNumber(POINTS_THRESHOLD)} points
            </span>
          </div>
        </div>
        <div className='flex flex-col gap-4 text-text-muted'>
          <div className='flex items-center gap-3'>
            <Image src={Moneybag} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
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
          <div className='flex items-center gap-3'>
            <Image src={Speaker} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Invite friends to join you, and get 10% of their earnings!
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
