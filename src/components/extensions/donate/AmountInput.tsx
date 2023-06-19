import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import { cx } from '@/utils/class-names'
import BN from 'bignumber.js'
import { formatUnits, parseUnits } from 'ethers'
import { useTheme } from 'next-themes'
import { ChangeEventHandler } from 'react'

type AmountInputProps = {
  setAmount: (amount: string) => void
  inputError?: string
  setInputError: (error?: string) => void
  amount: string
  tokenSymbol: string
  balance?: string
  decimals?: number
}

const AmountInput = ({
  amount,
  setAmount,
  setInputError,
  inputError,
  tokenSymbol,
  balance,
  decimals,
}: AmountInputProps) => {
  const { theme } = useTheme()
  const balanceValue =
    decimals && balance ? formatUnits(balance, decimals) : '0'

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const amountInputValue = e.target.value

    setAmount(amountInputValue)

    if (amountInputValue && decimals && balanceValue && balance) {
      const amountValue = parseUnits(amountInputValue, decimals)
      if (new BN(amountValue.toString()).gt(new BN(balance))) {
        setInputError('Amount exceeds available balance')
      } else {
        setInputError(undefined)
      }
    }
  }

  return (
    <div>
      <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-gray-400'>
        <div>Amount</div>
        <div>
          Balance:{' '}
          <span
            className={cx(
              'font-bold',
              theme === 'light' ? 'text-black' : 'text-white'
            )}
          >
            {balanceValue.slice(0, 6)} {tokenSymbol}
          </span>
        </div>
      </div>
      <Input
        step={0.1}
        min={0}
        value={amount}
        onChange={onInputChange}
        rightElement={() => (
          <div>
            <Button
              variant='transparent'
              className={cx(
                'absolute bottom-0 right-4 top-0 my-auto p-1 text-indigo-400',
                'hover:text-indigo-500 hover:ring-0'
              )}
              onClick={() => balance && setAmount(balanceValue)}
            >
              Max
            </Button>
          </div>
        )}
        type='number'
        className={cx(
          'h-[54px] pr-16 text-base leading-6 ring-1 ring-inset ring-gray-500',
          'focus:outline-none focus:ring-1 focus:ring-gray-400',
          'hover:outline-none hover:ring-1 hover:ring-gray-400',
          'focus-visible:!ring-1 focus-visible:ring-gray-400',
          theme === 'light'
            ? 'bg-slate-200 text-black'
            : 'bg-slate-900 text-white'
        )}
      />
      {inputError && <div className='text-sm text-red-400'>{inputError}</div>}
    </div>
  )
}

export default AmountInput
