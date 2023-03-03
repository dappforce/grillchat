import Bitcoin from '@/assets/topics/bitcoin.png'
import Ethereum from '@/assets/topics/ethereum.png'
import { ImageProps } from 'next/image'

export type Topic = {
  postId: string
  image: ImageProps['src']
  title: string
  desc: string
}

const topics = {
  bitcoin: {
    postId: '226',
    title: 'Bitcoin',
    desc: 'Bitcoin is a cryptocurrency and worldwide payment system.',
    image: Bitcoin,
  },
  ethereum: {
    postId: '355',
    title: 'Ethereum',
    desc: 'Ethereum is an open-source, public, blockchain-based distributed computing platform and operating system featuring smart contract (scripting) functionality.',
    image: Ethereum,
  },
} satisfies Record<string, Topic>

export function getAllTopics(): Readonly<typeof topics> {
  return topics
}
export function isSupportedTopic(topic: string): topic is keyof typeof topics {
  return topic in topics
}
export function getTopicData(topic: keyof typeof topics) {
  return topics[topic]
}
