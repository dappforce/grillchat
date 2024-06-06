import Diamond from '@/assets/emojis/diamond.png'
import Laugh from '@/assets/emojis/laugh.png'
import Speaker from '@/assets/emojis/speaker.png'
import { LocalStorage } from '@/utils/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Modal from './Modal'

const hasVisitedHomeStorage = new LocalStorage(() => 'has-visited-home')

export default function WelcomeModal() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  useEffect(() => {
    const hasVisited = hasVisitedHomeStorage.get() === 'true'
    if (!hasVisited) {
      hasVisitedHomeStorage.set('true')
      setIsOpenModal(true)
    }
  }, [])

  return (
    <Modal
      title='Welcome to Epic!'
      titleClassName='font-medium'
      isOpen={isOpenModal}
      closeModal={() => undefined}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 text-text-muted'>
          <div className='flex items-center gap-3'>
            <Image src={Laugh} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Epic is the Meme2Earn gaming platform for meme lovers!
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Image src={Diamond} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Users get points by having fun creating, liking, and tapping on
              memes.
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Image src={Speaker} className='h-8 w-8 flex-shrink-0' alt='' />
            <span className='font-medium text-text-muted'>
              Invite friends to join you, and get 10% of their earnings!
            </span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-background-lighter p-4'>
          <span className='font-medium text-text-muted'>
            Your welcome bonus:
          </span>
          <div className='-ml-2 flex items-center gap-2.5'>
            <Image src={Diamond} alt='' className='h-12 w-12' />
            <span className='flex items-center text-4xl font-bold'>15,000</span>
          </div>
        </div>
        <Button size='lg' onClick={() => setIsOpenModal(false)}>
          Claim my bonus!
        </Button>
      </div>
    </Modal>
  )
}
