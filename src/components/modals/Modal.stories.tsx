import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Button from '../Button'
import Modal, { ModalProps } from './Modal'

function ModalWrapper(props: Omit<ModalProps, 'isOpen' | 'closeModal'>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...props} isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  )
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/Modal',
  component: ModalWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof ModalWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Modal content',
  },
}

export const WithTitleAndDescription: Story = {
  args: {
    title: 'Modal title',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit aut ea voluptatem excepturi obcaecati exercitationem quaerat quidem cumque nobis veniam quasi, recusandae laboriosam, laborum consectetur rerum sunt ipsum! Dignissimos.',
    children: 'Modal content',
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Modal title',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit aut ea voluptatem excepturi obcaecati exercitationem quaerat quidem cumque nobis veniam quasi, recusandae laboriosam, laborum consectetur rerum sunt ipsum! Dignissimos.',
    children: 'Modal content',
    withFooter: true,
  },
}

export const WithBackButtonAndClose: Story = {
  args: {
    title: 'Modal title',
    description:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis suscipit aut ea voluptatem excepturi obcaecati exercitationem quaerat quidem cumque nobis veniam quasi, recusandae laboriosam, laborum consectetur rerum sunt ipsum! Dignissimos.',
    children: 'Modal content',
    onBackClick: () => undefined,
    withCloseButton: true,
  },
}
