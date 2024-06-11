import CheckImage from '@/assets/emojis/check.png'
import ForbiddenImage from '@/assets/emojis/forbidden.png'
import OpenHandsImage from '@/assets/emojis/open-hands.png'
import IntroImage from '@/assets/graphics/meme2earn-intro.png'
import Check1Image from '@/assets/graphics/memes/check-1.jpeg'
import Check2Image from '@/assets/graphics/memes/check-2.jpeg'
import Forbidden1Image from '@/assets/graphics/memes/forbidden-1.png'
import Forbidden2Image from '@/assets/graphics/memes/forbidden-2.png'
import { LocalStorage } from '@/utils/storage'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Card from '../Card'
import LinkText from '../LinkText'
import Modal from './Modal'

const hasVisitedStorage = new LocalStorage(() => 'has-visited')

const steps = [
  {
    title: 'How Meme2Earn works',
    content: HowItWorks,
  },
  {
    title: 'What can I post?',
    content: WhatCanIPost1,
  },
  {
    title: 'What can I post?',
    content: WhatCanIPost2,
  },
  {
    title: 'Final check',
    description:
      'We value and respect our users. Please adhere to the meme posting guidelines, or your content will be moderated. Have fun!',
    content: FinalCheck,
  },
]

export default function Meme2EarnIntroModal() {
  const [step, setStep] = useState(0)
  const [isOpenModal, setIsOpenModal] = useState(false)
  useEffect(() => {
    const hasVisited = hasVisitedStorage.get() === 'true'
    if (!hasVisited) {
      hasVisitedStorage.set('true')
      setIsOpenModal(true)
    }
  }, [])

  useEffect(() => {
    if (isOpenModal) {
      setStep(0)
    }
  }, [isOpenModal])

  const content = steps[step]
  if (!content) return null

  const Content = content.content

  return (
    <Modal
      title={content.title}
      description={content.description}
      titleClassName='font-medium'
      withCloseButton
      isOpen={isOpenModal}
      closeModal={() => {
        setIsOpenModal(false)
      }}
    >
      <div className='flex flex-col gap-6'>
        <Content />
        <Button
          size='lg'
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1)
              return
            }
            setIsOpenModal(false)
          }}
        >
          {step === steps.length - 1 ? 'Got it' : 'Next'}
        </Button>
      </div>
    </Modal>
  )
}

function HowItWorks() {
  return (
    <>
      <div className='flex flex-col gap-3.5 text-text-muted'>
        <span>👍 Post and like memes to earn Points</span>
        <span>💎 Creating a meme costs 2500 Points</span>
        <span>📅 Your meme can earn unlimited points for the first 7 days</span>
      </div>
      <Image src={IntroImage} alt='' className='h-auto w-full px-3' />
      <div className='flex justify-center'>
        <LinkText variant='primary' href='/guide'>
          Read the detailed information
        </LinkText>
      </div>
    </>
  )
}

function WhatCanIPost1() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-2 whitespace-nowrap'>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={CheckImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Memes</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={CheckImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Funny images</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Selfies</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Personal photos</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Full-screen screenshots</span>
        </Card>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col items-center'>
          <Image
            src={Check1Image}
            alt=''
            className='aspect-square h-full w-full rounded-lg object-cover'
          />
          <Image src={CheckImage} alt='' className='-mt-4 h-10 w-10' />
        </div>
        <div className='flex flex-col items-center'>
          <Image
            src={Forbidden1Image}
            alt=''
            className='aspect-square h-full w-full rounded-lg object-cover'
          />
          <Image src={ForbiddenImage} alt='' className='-mt-4 h-10 w-10' />
        </div>
      </div>
    </div>
  )
}

function WhatCanIPost2() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-2 whitespace-nowrap'>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={CheckImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Memes</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={CheckImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Funny images</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Selfies</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Personal photos</span>
        </Card>
        <Card className='flex items-center gap-2 rounded-full bg-background-lighter py-2 pl-3 pr-3.5'>
          <Image src={ForbiddenImage} alt='' className='h-4 w-4' />
          <span className='relative -top-px'>Full-screen screenshots</span>
        </Card>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col items-center'>
          <Image
            src={Check2Image}
            alt=''
            className='aspect-square h-full w-full rounded-lg object-cover'
          />
          <Image src={CheckImage} alt='' className='-mt-4 h-10 w-10' />
        </div>
        <div className='flex flex-col items-center'>
          <Image
            src={Forbidden2Image}
            alt=''
            className='aspect-square h-full w-full rounded-lg object-cover'
          />
          <Image src={ForbiddenImage} alt='' className='-mt-4 h-10 w-10' />
        </div>
      </div>
    </div>
  )
}

function FinalCheck() {
  return (
    <div className='flex items-center justify-center py-4'>
      <Image src={OpenHandsImage} alt='' className='h-28 w-28' />
    </div>
  )
}
