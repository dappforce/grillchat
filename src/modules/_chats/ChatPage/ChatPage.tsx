import Send from '@/assets/icons/send.png'
import Bitcoin from '@/assets/topics/bitcoin.png'
import Button from '@/components/Button'
import ChatRoom from '@/components/ChatRoom'
import Container from '@/components/Container'
import Input from '@/components/inputs/Input'
import ScrollableContainer from '@/components/ScrollableContainer'
import { cx } from '@/utils/className'
import Image from 'next/image'
import { useRouter } from 'next/router'
import ChatNavbarExtension from './ChatNavbarExtension'

const dummyChats = [
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'right',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'right',
  },
  {
    text: 'Hey guys, I want to build my first app on Subsocial. How should I start?',
    alignment: 'left',
  },
]

export default function ChatPage() {
  const router = useRouter()
  const { topic } = router.query as { topic: string }

  return (
    <>
      <ChatNavbarExtension image={Bitcoin} messageCount={96} topic={topic} />
      <ScrollableContainer as={Container}>
        <ChatRoom className='mt-2' chats={dummyChats as any} />
      </ScrollableContainer>
      <Container className='mt-auto flex py-3'>
        <Input
          placeholder='Message...'
          rightElement={(classNames) => (
            <Button circleButton className={cx(classNames)}>
              <Image
                className='relative top-px h-4 w-4'
                src={Send}
                alt='send'
              />
            </Button>
          )}
        />
      </Container>
    </>
  )
}
