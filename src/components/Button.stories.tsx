import type { Meta, StoryObj } from '@storybook/react'
import { HiAcademicCap } from 'react-icons/hi2'

import Button from './Button'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/Button',
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

export const IconButton: Story = {
  args: {
    size: 'circle',
    children: <HiAcademicCap />,
  },
}

export const DisabledButton: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledSubtleButton: Story = {
  args: {
    disabled: true,
    disabledStyle: 'subtle',
  },
}
