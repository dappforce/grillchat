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
  args: {},
} satisfies Meta<typeof ChatItemWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Regular: Story = {
  args: {
    chatId: '1',
    messageId: '7667',
    isMyMessage: false,
  },
}

export const RegularMyMessage: Story = {
  args: {
    chatId: '1',
    messageId: '7667',
    isMyMessage: true,
  },
}

export const MultilineMessage: Story = {
  args: {
    chatId: '1',
    messageId: '608',
    isMyMessage: false,
  },
}

export const MessageWithReply: Story = {
  args: {
    chatId: '1',
    messageId: '1770',
    isMyMessage: false,
  },
}

export const EmojiMessage: Story = {
  args: {
    chatId: '1',
    messageId: '4821',
    isMyMessage: false,
  },
}
export const DoubleEmojiMessage: Story = {
  args: {
    chatId: '1',
    messageId: '1584',
    isMyMessage: false,
  },
}
export const TripleEmojiMessage: Story = {
  args: {
    chatId: '1',
    messageId: '1585',
    isMyMessage: false,
  },
}
