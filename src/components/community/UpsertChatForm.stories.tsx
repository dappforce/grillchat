import type { Meta, StoryObj } from '@storybook/react'

import UpsertChatForm from './UpsertChatForm'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Layouts/UpsertChatForm',
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

// export const UpdateForm: Story = {
//   render: (props) => {
//     const { data: chat } = getPostQuery.useQuery('1')
//     return chat ? (
//       <UpsertChatForm chat={chat} {...props} />
//     ) : (
//       <div>Loading...</div>
//     )
//   },
//   // @ts-ignore
//   args: {},
// }
