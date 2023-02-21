import Bitcoin from '@/assets/topics/bitcoin.png'
import Cosmos from '@/assets/topics/cosmos.png'
import Ethereum from '@/assets/topics/ethereum.png'
import Near from '@/assets/topics/near.png'
import Polkadot from '@/assets/topics/polkadot.png'
import ChatPreview from '@/components/ChatPreview'
import { cx } from '@/utils/className'
import type { ImageProps } from 'next/image'

type Topic = {
  image: ImageProps['src']
  title: string
  desc: string
}
const topics: Topic[] = [
  {
    title: 'Bitcoin',
    image: Bitcoin,
    desc: 'You can use an exchange to buy crypto',
  },
  { title: 'Ethereum', image: Ethereum, desc: 'Hello everyone!' },
  {
    title: 'Polkadot',
    image: Polkadot,
    desc: 'Good day, I would like to create a network with new ',
  },
  { title: 'Cosmos', image: Cosmos, desc: 'GM guys :)' },
  {
    title: 'NEAR',
    image: Near,
    desc: 'Is this something crucial that you need now?',
  },
]

export default function HomePage() {
  return (
    <main className={cx('bg-background')}>
      <div className='flex flex-col'>
        {topics.map(({ desc, image, title }) => (
          <ChatPreview
            key={title}
            asContainer
            asLink={{ href: '/' }}
            image={image}
            title={title}
            description={desc}
          />
        ))}
      </div>
    </main>
  )
}
