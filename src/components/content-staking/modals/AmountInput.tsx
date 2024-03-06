import Button from '@/components/Button'
import FormatBalance from '@/components/FormatBalance'
import Input from '@/components/inputs/Input'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getStakingConstsData } from '@/services/contentStaking/stakingConsts/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { parseBalance } from '@/utils/formatBalance'
import {
  balanceWithDecimal,
  convertToBalanceWithDecimal,
} from '@subsocial/utils'
import BN from 'bignumber.js'
import clsx from 'clsx'
import { ChangeEventHandler, useEffect, useRef } from 'react'
import { calculateBalanceForStaking } from '../utils'
import { StakingModalVariant } from './StakeModal'

type CommonAmountInputProps = {
  setAmount: (amount: string) => void
  inputError?: string
  setInputError: (error?: string) => void
  amount?: string
  tokenSymbol?: string
  decimals?: number
  label: string
  balanceLabel?: string
  spaceId?: string
  modalVariant?: StakingModalVariant
}

type AmountInputProps = CommonAmountInputProps & {
  balanceValue?: JSX.Element
  validateInput: (amountValue: string) => void
  onMaxAmountClick?: () => void
  className?: string
}

export const StakeOrIncreaseStakeAmountInput = (
  props: CommonAmountInputProps
) => {
  const { tokenSymbol, decimals, setInputError, modalVariant } = props
  const myAddress = useMyMainAddress()
  const { data: stakingConsts } = getStakingConstsData()

  const { minimumStakingAmount, minimumRemainingAmount } = stakingConsts || {}

  const { data: balanceByNetwork } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })

  const balanceByCurrency = balanceByNetwork?.balances?.[tokenSymbol || '']

  const availableBalance = balanceByCurrency
    ? calculateBalanceForStaking(balanceByCurrency, 'crestake')
    : new BN(0)

  const onMaxAmountClick = async () => {
    const subsocialApi = await getSubsocialApi()

    const api = await subsocialApi.substrateApi

    const tx = api.tx.creatorStaking.stake(
      props.spaceId,
      availableBalance.toString()
    )

    const paymentInfo = myAddress ? await tx.paymentInfo(myAddress) : undefined

    const partialFee = paymentInfo?.partialFee

    const balance = partialFee
      ? new BN(availableBalance.toString())
          .minus(new BN(partialFee.toString()))
          .minus(new BN(minimumRemainingAmount || 0))
      : new BN(0)

    const maxAmount =
      partialFee && decimals
        ? convertToBalanceWithDecimal(balance.toString(), decimals)
        : new BN(0)

    props.setAmount(!maxAmount.lte(0) ? maxAmount.toString() : '')
    validateInput(maxAmount.toString())
  }

  const balanceValue = parseBalance(availableBalance.toString(), decimals)

  const validateInput = (amountValue: string) => {
    const amountWithDecimals = balanceWithDecimal(amountValue, decimals || 0)

    if (
      minimumStakingAmount &&
      amountWithDecimals.lt(new BN(minimumStakingAmount)) &&
      modalVariant === 'stake'
    ) {
      const minimumStakingAmountWithDecimals = convertToBalanceWithDecimal(
        minimumStakingAmount,
        decimals || 0
      )
      setInputError(
        `Amount must be greater than ${minimumStakingAmountWithDecimals} ${tokenSymbol}`
      )
    } else if (amountWithDecimals.gt(new BN(availableBalance.toString()))) {
      setInputError('Amount exceeds available balance')
    } else if (amountWithDecimals.lte(new BN(0))) {
      setInputError('Amount must be greater than 0')
    } else if (
      minimumRemainingAmount &&
      new BN(availableBalance.toString())
        .minus(amountWithDecimals)
        .lt(minimumRemainingAmount)
    ) {
      const minimumRemainingAmountWithDecimals = convertToBalanceWithDecimal(
        minimumRemainingAmount,
        decimals || 0
      )

      setInputError(
        `You must leave at least ${minimumRemainingAmountWithDecimals} SUB in your account`
      )
    } else {
      setInputError(undefined)
    }
  }

  return (
    <AmountInput
      {...props}
      onMaxAmountClick={onMaxAmountClick}
      balanceValue={
        <FormatBalance
          value={balanceValue}
          symbol={tokenSymbol}
          defaultMaximumFractionDigits={3}
        />
      }
      validateInput={validateInput}
    />
  )
}

export const UnstakeAmountInput = (props: CommonAmountInputProps) => {
  const myAddress = useMyMainAddress()
  const { data: stakingConsts } = getStakingConstsData()
  const { tokenSymbol, decimals, setInputError } = props

  const { minimumStakingAmount } = stakingConsts || {}

  const { data: backerLedger } = getBackerLedgerQuery.useQuery(myAddress || '')

  const { locked } = backerLedger || {}

  const onMaxAmountClick = () => {
    const maxAmount =
      decimals && locked
        ? convertToBalanceWithDecimal(locked, decimals)
        : new BN(0)

    props.setAmount(!maxAmount.lte(0) ? maxAmount.toString() : '')

    validateInput(maxAmount.toString())
  }

  const balanceValue = parseBalance(locked, decimals)

  const validateInput = (amountValue: string) => {
    const amountWithDecimals = balanceWithDecimal(amountValue, decimals || 0)

    const canUnstake =
      locked &&
      new BN(locked)
        .minus(amountWithDecimals)
        .gte(new BN(minimumStakingAmount || 0))

    if (amountWithDecimals.lte(new BN(0))) {
      setInputError('Amount must be greater than 0')
    } else if (
      (minimumStakingAmount && amountValue && canUnstake) ||
      amountWithDecimals.eq(locked || '0')
    ) {
      setInputError(undefined)
    } else if (locked && amountWithDecimals.gt(new BN(locked))) {
      setInputError('Amount exceeds staked value')
    } else {
      const minimumStakingAmountWithDecimals = convertToBalanceWithDecimal(
        minimumStakingAmount || '0',
        decimals || 0
      )

      setInputError(
        `${minimumStakingAmountWithDecimals} ${tokenSymbol} minimum stake, please leave ${minimumStakingAmountWithDecimals}+ ${tokenSymbol} or unstake all`
      )
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <AmountInput
        {...props}
        balanceValue={
          <FormatBalance
            value={balanceValue}
            symbol={tokenSymbol}
            defaultMaximumFractionDigits={3}
          />
        }
        onMaxAmountClick={onMaxAmountClick}
        validateInput={validateInput}
      />
    </div>
  )
}

export const AmountInput = ({
  amount,
  setAmount,
  inputError,
  balanceLabel,
  label,
  balanceValue,
  onMaxAmountClick,
  validateInput,
  className,
}: AmountInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const amountInputValue = e.target.value

    validateInput(amountInputValue)

    setAmount(amountInputValue)
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div>
      <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-text-muted'>
        <div>{label}</div>
        {balanceValue && (
          <div>
            {balanceLabel}:{' '}
            <span className={clsx('font-semibold text-text')}>
              {balanceValue}
            </span>
          </div>
        )}
      </div>
      <Input
        ref={inputRef}
        step={0.1}
        min={0}
        value={amount}
        placeholder='0'
        autoFocus={true}
        onChange={onInputChange}
        error={inputError}
        rightElement={() => (
          <div>
            <Button
              variant='transparent'
              className={clsx(
                '!absolute bottom-0 right-3 top-0 my-auto !p-1 text-indigo-400',
                'hover:!text-indigo-500 hover:!ring-0'
              )}
              onClick={() => onMaxAmountClick && onMaxAmountClick()}
            >
              Max
            </Button>
          </div>
        )}
        type='number'
        className={clsx(
          'h-[48px] pr-16 text-base leading-6 ring-1 ring-inset ring-indigo-500',
          'focus:outline-none focus:ring-1 focus:ring-indigo-500',
          'hover:outline-none hover:ring-1 hover:ring-indigo-500',
          'focus-visible:!ring-1 focus-visible:ring-indigo-500',
          'text-text',
          className
        )}
      />
    </div>
  )
}
