import LikeButtonImage from '@/assets/graphics/like-button.png'
import LikeDemoImage from '@/assets/graphics/like-message.png'
import { useSendEvent } from '@/stores/analytics'
import { LocalStorage } from '@/utils/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Modal from './Modal'

const hasOpenedModal = new LocalStorage(() => 'has-opened-like-intro-modal')

export default function LikeIntroModal() {
  const sendEvent = useSendEvent()
  const [isOpenModal, setIsOpenModal] = useState(false)
  useEffect(() => {
    const hasVisited = hasOpenedModal.get() === 'true'
    if (!hasVisited) {
      sendEvent('like_intro_modal_opened')
      setIsOpenModal(true)
    }
  }, [sendEvent])

  return (
    <Modal
      isOpen={isOpenModal}
      closeModal={() => undefined}
      title='Earn Points by liking memes!'
      description={
        <span>
          To get your Points for liking a meme, simply tap on{' '}
          <Image
            src={LikeButtonImage}
            alt=''
            className='inline-block h-[22px] w-auto'
          />{' '}
          below the meme.
        </span>
      }
    >
      <Image src={LikeDemoImage} className='h-auto w-full' alt='' />
      <Button
        size='lg'
        className='mt-2'
        onClick={() => {
          hasOpenedModal.set('true')
          setIsOpenModal(false)
          sendEvent('like_intro_modal_closed')
        }}
      >
        Got it!
      </Button>
    </Modal>
  )
}
