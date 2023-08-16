import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Button from '../Button'
import MessageModal, { MessageModalProps } from './MessageModal'

function MessageModalWrapper(
  props: Omit<MessageModalProps, 'isOpen' | 'closeModal'>
) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <MessageModal
        {...props}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  )
}

const meta = {
  title: 'Components/MessageModal',
  component: MessageModalWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    hubId: '1001',
    messageId: '7687',
    scrollToMessage: async (messageId) => {
      alert('Scroll to message: ' + messageId)
    },
  },
} satisfies Meta<typeof MessageModalWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithTargetAccount: Story = {
  args: {
    recipient: '3szaLms2V18XCr2ztvjzcPF16BxvbGeAW4fEG2yeb19XGdGV',
  },
}
