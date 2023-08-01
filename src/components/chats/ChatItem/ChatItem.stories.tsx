import { getPostQuery } from '@/services/api/query'
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'
import ChatItem from './ChatItem'

function ChatItemWrapper(
  props: Omit<ComponentProps<typeof ChatItem>, 'message'> & {
    messageId: string
  }
) {
  const { data: message } = getPostQuery.useQuery(props.messageId)
  return message ? (
    <ChatItem {...props} message={message} />
  ) : (
    <div>Loading...</div>
  )
}

const meta = {
  title: 'Chats/ChatItem',
  component: ChatItemWrapper,
  tags: ['autodocs'],
  args: {
    chatId: '1',
  },
} satisfies Meta<typeof ChatItemWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Regular: Story = {
  args: {
    messageId: '7667',
    isMyMessage: false,
  },
}

export const RegularMyMessage: Story = {
  args: {
    messageId: '7667',
    isMyMessage: true,
  },
}

export const MultilineMessage: Story = {
  args: {
    messageId: '608',
    isMyMessage: false,
  },
}

export const MessageWithReply: Story = {
  args: {
    messageId: '1770',
    isMyMessage: false,
  },
}

export const EmojiMessage: Story = {
  args: {
    messageId: '4821',
    isMyMessage: false,
  },
}
export const DoubleEmojiMessage: Story = {
  args: {
    messageId: '1584',
    isMyMessage: false,
  },
}
export const TripleEmojiMessage: Story = {
  args: {
    messageId: '1585',
    isMyMessage: false,
  },
}

export const EmojiMessageWithReply: Story = {
  args: {
    messageId: '2700',
    isMyMessage: false,
  },
}

export const NftMessage: Story = {
  args: {
    messageId: '5380',
    isMyMessage: false,
  },
}

export const NftGifMessage: Story = {
  args: {
    messageId: '5386',
    isMyMessage: false,
  },
}

export const NftVideoMessage: Story = {
  args: {
    messageId: '5318',
    isMyMessage: false,
  },
}

export const ImageMessage: Story = {
  args: {
    messageId: '7633',
    isMyMessage: false,
  },
}

export const ImageWithLongTextMessage: Story = {
  args: {
    messageId: '7461',
    isMyMessage: false,
  },
}

export const DonationMessage: Story = {
  args: {
    messageId: '7480',
    isMyMessage: false,
  },
}
