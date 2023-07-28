import type { Meta, StoryObj } from '@storybook/react'
import { HiAcademicCap } from 'react-icons/hi2'
import ActionCard from './ActionCard'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/ActionCard',
  component: ActionCard,
  tags: ['autodocs'],
  render: (props) => {
    return (
      <div className='bg-background-light p-16'>
        <ActionCard {...props} />
      </div>
    )
  },
  args: {
    actions: [
      { text: 'Action 1', icon: HiAcademicCap },
      { text: 'Action 2', icon: HiAcademicCap },
      { text: 'Action 3', icon: HiAcademicCap },
    ],
  },
} satisfies Meta<typeof ActionCard>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const MediumSize: Story = {
  args: {},
}

export const SmallSize: Story = {
  args: {
    size: 'sm',
  },
}

export const MutedIcon: Story = {
  args: {
    actions: [
      {
        text: 'Action 1',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
      },
      {
        text: 'Action 2',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
      },
    ],
  },
}

export const CustomColor: Story = {
  args: {
    actions: [
      {
        text: 'Action 1',
        icon: HiAcademicCap,
        className: 'text-text-red',
      },
      {
        text: 'Action 2',
        icon: HiAcademicCap,
        className: 'text-text-warning',
      },
    ],
  },
}

export const DisabledOrComingSoonItem: Story = {
  args: {
    actions: [
      {
        text: 'Action 1',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
      },
      {
        text: 'Disabled Action',
        icon: HiAcademicCap,
        disabled: true,
      },
      {
        text: 'Coming Soon Action',
        icon: HiAcademicCap,
        isComingSoon: true,
      },
    ],
  },
}

export const WithDescription: Story = {
  args: {
    actions: [
      {
        text: 'Action 1',
        description: 'Action 1 is doing something cool',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
      },
      {
        text: 'Disabled Action',
        description: 'Action 2 is currently disabled',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
        disabled: true,
      },
      {
        text: 'Coming Soon Action',
        description: 'Action 1 is coming soon',
        iconClassName: 'text-text-muted',
        icon: HiAcademicCap,
        isComingSoon: true,
      },
    ],
  },
}
