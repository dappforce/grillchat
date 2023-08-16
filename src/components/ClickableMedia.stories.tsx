import type { Meta, StoryObj } from '@storybook/react'

import ClickableMedia from './ClickableMedia'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/ClickableMedia',
  component: ClickableMedia,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    src: 'https://ipfs.subsocial.network/ipfs/bafybeidjulzfloyxfrzcwdvzhshko6auptimtopm6zln3jlrm5gxcal5ba',
    alt: '',
    width: 300,
    height: 300,
  },
} satisfies Meta<typeof ClickableMedia>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Main: Story = {
  args: {},
}
