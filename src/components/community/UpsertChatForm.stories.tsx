import { getPostQuery } from '@/services/api/query'
import type { Meta, StoryObj } from '@storybook/react'

import UpsertChatForm, { UpsertChatFormProps } from './UpsertChatForm'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Community/UpsertChatForm',
  component: UpsertChatForm,
  tags: ['autodocs'],
  args: {
    onSuccess: () => alert('onSuccess!'),
    onTxSuccess: () => alert('onTxSuccess!'),
  },
} satisfies Meta<typeof UpsertChatForm>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const InsertForm: Story = {
  args: {
    hubId: '1025',
  },
}

function UpdateFormWrapper(props: UpsertChatFormProps) {
  const { data: chat } = getPostQuery.useQuery('1')
  return chat ? (
    <UpsertChatForm chat={chat} {...props} />
  ) : (
    <div>Loading...</div>
  )
}

export const UpdateForm: Story = {
  render: (props) => <UpdateFormWrapper {...props} />,
  // @ts-ignore
  args: {},
}
