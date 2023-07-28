import { sourceSans3 } from '@/fonts'
import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary',
    style: {
      fontFamily: sourceSans3.style.fontFamily,
    },
  },
}

export const PrimaryOutline: Story = {
  args: {
    variant: 'primaryOutline',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}
