import Button from '@/components/Button'
import Card from '@/components/Card'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { BiCoinStack } from 'react-icons/bi'
import { SlQuestion } from 'react-icons/sl'

export type RightSidebarProps = ComponentProps<'div'>

export default function RightSidebar({ ...props }: RightSidebarProps) {
  return (
    <aside
      {...props}
      className={cx('flex flex-col px-4 py-4', props.className)}
    >
      <span className='flex items-center gap-2 text-xl font-medium'>
        Earn SUB <SlQuestion className='text-base text-text-muted' />
      </span>
      <Card className='mt-3 flex flex-col bg-background-light p-0'>
        <div className='p-4'>
          <span className='text-sm leading-normal text-text-muted'>
            Generate rewards for both you and your favorite creators by staking
            towards them
          </span>
        </div>
        <Button
          variant='transparent'
          size='noPadding'
          interactive='none'
          className={cx(
            'flex items-center justify-center gap-2 rounded-none rounded-b-2xl border-t border-background-lighter py-3 font-medium text-text-secondary',
            'hover:bg-background-lighter'
          )}
        >
          <BiCoinStack className='text-sm' />
          <span>Start Staking</span>
        </Button>
      </Card>
    </aside>
  )
}
