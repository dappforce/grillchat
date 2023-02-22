import Bitcoin from '@/assets/topics/bitcoin.png'
import Cosmos from '@/assets/topics/cosmos.png'
import Ethereum from '@/assets/topics/ethereum.png'
import Near from '@/assets/topics/near.png'
import Polkadot from '@/assets/topics/polkadot.png'
import ChatPreview from '@/components/chats/ChatPreview'
import type { ImageProps } from 'next/image'
import WelcomeModal from './WelcomeModal'

type Topic = {
  id: string
  image: ImageProps['src']
  title: string
  desc: string
}
const topics: Topic[] = [
  {
    id: 'bitcoin',
    title: 'Bitcoin',
    image: Bitcoin,
    desc: 'You can use an exchange to buy crypto',
  },
  {
    id: 'ethereum',
    title: 'Ethereum',
    image: Ethereum,
    desc: 'Hello everyone!',
  },
  {
    id: 'polkadot',
    title: 'Polkadot',
    image: Polkadot,
    desc: 'Good day, I would like to create a network with new ',
  },
  {
    id: 'cosmos',
    title: 'Cosmos',
    image: Cosmos,
    desc: 'GM guys :)',
  },
  {
    id: 'near',
    title: 'NEAR',
    image: Near,
    desc: 'Is this something crucial that you need now?',
  },
]

export default function HomePage() {
  return (
    <>
      <WelcomeModal />
      <div className='flex flex-col'>
        {topics.map(({ id, desc, image, title }) => (
          <ChatPreview
            key={title}
            asContainer
            asLink={{
              href: { pathname: '/chats/[topic]', query: { topic: id } },
            }}
            image={image}
            title={title}
            description={desc}
          />
        ))}
      </div>
    </>
  )
}
