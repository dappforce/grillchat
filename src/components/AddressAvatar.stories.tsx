import { ApiAccountDataResponse } from '@/pages/api/accounts-data'
import type { Meta, StoryObj } from '@storybook/react'
import { rest } from 'msw'
import AddressAvatar from './AddressAvatar'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/AddressAvatar',
  component: AddressAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        rest.get('/api/accounts-data', (req, res, ctx) => {
          const mockRes: ApiAccountDataResponse = {
            message: 'OK',
            success: true,
            data: [
              {
                ensName: null,
                evmAddress: null,
                grillAddress:
                  '3o3kUjz9s1WZ5AZPxn24ybW3orTmKkUEd83AXzV5WgzgwQ59',
              },
              {
                ensName: 'vitalik.eth',
                evmAddress: '0x5f9f09D6484713FABBed04A188591B85958AbFF3',
                grillAddress:
                  '3psECVdeegzi8HzDUSVQUKwZPkrdHsUGbrMdN8uK35hjxNEF',
              },
            ],
          }
          return res(ctx.json(mockRes))
        }),
      ],
    },
  },
  args: {
    address: '3o3kUjz9s1WZ5AZPxn24ybW3orTmKkUEd83AXzV5WgzgwQ59',
  },
} satisfies Meta<typeof AddressAvatar>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const NoEns: Story = {
  args: {},
}

export const Ens: Story = {
  args: {
    address: '3psECVdeegzi8HzDUSVQUKwZPkrdHsUGbrMdN8uK35hjxNEF',
  },
}
