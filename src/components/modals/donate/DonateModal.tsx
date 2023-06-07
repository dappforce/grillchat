import Poligon from '@/assets/graphics/poligon.png'
import USDC from '@/assets/graphics/usdc.png'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import Dropdown, { ListItem } from '@/components/inputs/SelectInput'
import TextArea from '@/components/inputs/TextArea'
import ProfilePreview from '@/components/ProfilePreview'
import useGetTheme from '@/hooks/useGetTheme'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import Modal, { ModalFunctionalityProps } from '../Modal'

const chainItems = [
  {
    icon: Poligon,
    label: 'Poligon',
  },
  {
    icon: Poligon,
    label: 'Poligon1',
  },
  {
    icon: Poligon,
    label: 'Poligon2',
  },
]

const tokensItems = [
  {
    icon: USDC,
    label: 'USDC',
  },
  {
    icon: USDC,
    label: 'USDC1',
  },
  {
    icon: USDC,
    label: 'USDC2',
  },
]

type AmountInputProps = {}

const AmountInput = ({}: AmountInputProps) => {
  return (
    <div>
      <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-gray-400'>
        <div>Amount</div>
        <div>
          Balance: <span className='font-bold text-white'>50 USDC</span>
        </div>
      </div>
      <Input
        rightElement={() => (
          <div>
            <Button
              variant='transparent'
              className={cx(
                'absolute bottom-0 right-4 top-0 my-auto p-1 text-indigo-400',
                'hover:text-indigo-500 hover:ring-0'
              )}
            >
              Max
            </Button>
          </div>
        )}
        type='number'
        className={cx(
          'h-[54px] bg-slate-900 pr-16 text-base leading-6 ring-1 ring-inset ring-gray-500',
          'focus:outline-none focus:ring-1 focus:ring-gray-400',
          'hover:outline-none hover:ring-1 hover:ring-gray-400',
          'focus-visible:!ring-1 focus-visible:ring-gray-400'
        )}
      />
    </div>
  )
}

type DonateModalProps = ModalFunctionalityProps & {
  recipient: string
}

export default function DonateModal({ recipient, ...props }: DonateModalProps) {
  const theme = useGetTheme()
  const isDarkTheme = theme === 'dark'
  const [selectedChain, setSelectedChain] = useState<ListItem>(chainItems[0])
  const [selectedToken, setSelectedToken] = useState<ListItem>(tokensItems[0])

  return (
    <Modal
      title='💰 Donate'
      withCloseButton
      titleClassName='px-6'
      contentClassName='px-0'
      {...props}
    >
      <div className='px-6'>
        <div
          className={cx(
            'mb-6 mt-2 rounded-2xl p-4',
            isDarkTheme ? 'bg-slate-700' : 'bg-slate-200'
          )}
        >
          <ProfilePreview address={recipient} />
        </div>
        <div className='flex flex-col gap-6'>
          <Dropdown
            selected={selectedChain}
            setSelected={setSelectedChain}
            fieldLabel='Chain'
            items={chainItems}
          />
          <Dropdown
            selected={selectedToken}
            setSelected={setSelectedToken}
            fieldLabel='Token'
            items={tokensItems}
          />
          <AmountInput />
        </div>
      </div>
      <div className='mb-3 mt-6 ring-1 ring-gray-600'></div>
      <TextArea
        className={cx(
          'mb-4 border-none px-6',
          'hover:ring-0 focus-visible:!ring-0 active:border-none'
        )}
        placeholder='Message...'
        rows={1}
      />
      <div className='px-6'>
        <Button className='w-full' size='lg'>
          Send
        </Button>
      </div>
    </Modal>
  )
}
