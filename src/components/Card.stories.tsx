import type { Meta, StoryObj } from '@storybook/react'

import CardComponent from './Card'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/Card',
  component: CardComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Card Content',
  },
} satisfies Meta<typeof CardComponent>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Card: Story = {
  args: {},
}
