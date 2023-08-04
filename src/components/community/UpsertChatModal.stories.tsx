import { getPostQuery } from '@/services/api/query'
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentProps, useState } from 'react'
import Button from '../Button'

import UpsertChatModal, { UpsertChatModalProps } from './UpsertChatModal'

function ModalWrapper(
  props: Partial<UpsertChatModalProps> & Pick<UpsertChatModalProps, 'formProps'>
) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpsertChatModal
        {...props}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  )
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Community/UpsertChatModal',
  component: ModalWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof ModalWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const CreateChatModal: Story = {
  args: {
    formProps: {
      hubId: '1025',
    },
  },
}

function UpdateModalWrapper(props: ComponentProps<typeof ModalWrapper>) {
  const { data: chat } = getPostQuery.useQuery('1')
  return chat ? (
    <ModalWrapper {...props} formProps={{ chat }} />
  ) : (
    <div>Loading...</div>
  )
}
export const UpdateChatModal: Story = {
  render: (props) => <UpdateModalWrapper {...props} />,
  // @ts-ignore
  args: {},
}
