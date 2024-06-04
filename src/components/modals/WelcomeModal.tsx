import IntroImage from '@/assets/graphics/meme2earn-intro.png'
import { LocalStorage } from '@/utils/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../Button'
import LinkText from '../LinkText'
import Modal from './Modal'

const hasVisitedStorage = new LocalStorage(() => 'has-visited')

export default function WelcomeModal() {
  const [isOpenModal, setIsOpenModal] = useState(false)
  useEffect(() => {
    const hasVisited = hasVisitedStorage.get() === 'true'
    if (!hasVisited) {
      setIsOpenModal(true)
    }
  }, [])

  return (
    <Modal
      title='How Meme2Earn works'
      titleClassName='font-medium'
      withCloseButton
      isOpen={isOpenModal}
      closeModal={() => {
        setIsOpenModal(false)
        hasVisitedStorage.set('true')
      }}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3.5 text-text-muted'>
          <span>👍 Post and like memes to earn Points</span>
          <span>💎 Creating a meme costs 2500 Points</span>
          <span>
            📅 Your meme can earn unlimited points for the first 7 days
          </span>
        </div>
        <Image src={IntroImage} alt='' className='h-auto w-full px-3' />
        <div className='flex justify-center'>
          <LinkText variant='primary' href='/guide'>
            Read the detailed information
          </LinkText>
        </div>
        <Button size='lg' onClick={() => setIsOpenModal(false)}>
          Got it!
        </Button>
      </div>
    </Modal>
  )
}
