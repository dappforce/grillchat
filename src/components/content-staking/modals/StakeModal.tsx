import PopOver from '@/components/floating/PopOver'
import Modal from '@/components/modals/Modal'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { getStakingConstsData } from '@/services/contentStaking/stakingConsts/query'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { formatBalance } from '@/utils/formatBalance'
import { convertToBalanceWithDecimal } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useEffect, useState } from 'react'
import { BsQuestionCircle } from 'react-icons/bs'
import { DaysToWithdrawWarning } from '../utils/DaysToWithdraw'
import { sectionBg } from '../utils/SectionWrapper'
import {
  StakeOrIncreaseStakeAmountInput,
  UnstakeAmountInput,
} from './AmountInput'
import { StakeOrIncreaseTxButton, UnstakeTxButton } from './TxButtons'

const CurrentStake = () => {
  const myAddress = useMyMainAddress()
  const { data: backerLedger } = getBackerLedgerQuery.useQuery(myAddress || '')
  const { data: consts } = getStakingConstsData()
  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const { locked } = backerLedger || {}

  const { minimumStakingAmount } = consts || {}

  const currentStake = formatBalance(locked, decimal)

  const showMimimumStake = new BN(locked || '0').lt(minimumStakingAmount || '0')

  const minimumStake = minimumStakingAmount
    ? convertToBalanceWithDecimal(minimumStakingAmount, decimal || 0)
    : '0'

  const requiredLock = formatBalance(
    new BN(minimumStakingAmount || '0').minus(locked || '0').toString(),
    decimal
  )

  return (
    <div className='flex items-center gap-4'>
      <div
        className={cx('flex w-full flex-col gap-1 rounded-2xl p-4', sectionBg)}
      >
        <div className='text-sm leading-5 text-text-muted'>My current lock</div>
        <div className='text-base font-medium leading-6'>
          {currentStake} {tokenSymbol}
        </div>
      </div>
      {showMimimumStake && (
        <div className='flex w-full flex-col gap-1 rounded-2xl bg-gray-50 p-4'>
          <PopOver
            trigger={
              <div className='flex items-center gap-2 text-sm leading-5 text-text-muted'>
                Additional lock required <BsQuestionCircle />
              </div>
            }
            panelSize='sm'
            yOffset={4}
            placement='top'
            triggerOnHover
          >
            In order to qualify for Content Staking, you need to lock at least{' '}
            {minimumStake.toString()} SUB
          </PopOver>
          <div className='text-base font-medium leading-6'>
            {requiredLock} {tokenSymbol}
          </div>
        </div>
      )}
    </div>
  )
}

const MinimumStake = () => {
  const { data: consts } = getStakingConstsData()
  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const { minimumStakingAmount } = consts || {}

  const minimumStaking = formatBalance(minimumStakingAmount, decimal)

  return (
    <div
      className={cx('flex w-full flex-col gap-1 rounded-2xl p-4', sectionBg)}
    >
      <div className='text-sm leading-5 text-text-muted'>Minimum lock</div>
      <div className='text-base font-medium leading-6'>
        {minimumStaking} {tokenSymbol}
      </div>
    </div>
  )
}

export type StakingModalVariant = 'stake' | 'unstake' | 'increaseStake'

const modalData = {
  stake: {
    title: '🌟 Lock SUB',
    inputLabel: 'Amount to lock:',
    balanceLabel: 'Balance',
    modalButton: 'Lock',
    amountInput: StakeOrIncreaseStakeAmountInput,
    actionButton: StakeOrIncreaseTxButton,
  },
  unstake: {
    title: '📤 Unlock SUB',
    inputLabel: 'Amount',
    balanceLabel: 'Locked',
    modalButton: 'Unlock',
    amountInput: UnstakeAmountInput,
    actionButton: UnstakeTxButton,
  },
  increaseStake: {
    title: '🌟 Lock more SUB',
    inputLabel: 'Increase locked amount',
    balanceLabel: 'Balance',
    modalButton: 'Lock',
    amountInput: StakeOrIncreaseStakeAmountInput,
    actionButton: StakeOrIncreaseTxButton,
  },
}

type StakeModalProps = {
  closeModal: () => void
  open: boolean
  spaceId: string
  modalVariant: StakingModalVariant
  amount?: string
  eventSource?: string
  setAmount: (amount: string) => void
}

const StakingModal = ({
  open,
  closeModal,
  spaceId,
  modalVariant,
  setAmount,
  amount,
  eventSource,
}: StakeModalProps) => {
  const [inputError, setInputError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (open) {
      setAmount('')
      inputError && setInputError(undefined)
    }
  }, [open])

  const { data: stakingConsts } = getStakingConstsData()

  const { decimal, tokenSymbol } = useGetChainDataByNetwork('subsocial') || {}

  const {
    title,
    inputLabel,
    balanceLabel,
    modalButton,
    actionButton,
    amountInput,
  } = modalData[modalVariant]

  const StakingTxButton = actionButton

  const AmountInput = amountInput

  return (
    <Modal
      isOpen={open}
      withFooter={false}
      title={title}
      withCloseButton
      closeModal={() => {
        closeModal()
      }}
    >
      <div className='flex flex-col gap-4 md:gap-6'>
        {modalVariant === 'increaseStake' && <CurrentStake />}
        {modalVariant === 'stake' && <MinimumStake />}
        <AmountInput
          amount={amount}
          setAmount={setAmount}
          tokenSymbol={tokenSymbol}
          decimals={decimal}
          setInputError={setInputError}
          inputError={inputError}
          label={inputLabel}
          spaceId={spaceId}
          balanceLabel={balanceLabel}
          modalVariant={modalVariant}
        />

        <DaysToWithdrawWarning
          unbondingPeriodInEras={stakingConsts?.unbondingPeriodInEras}
        />

        <StakingTxButton
          amount={amount}
          decimal={decimal || 0}
          spaceId={spaceId}
          label={modalButton}
          eventSource={eventSource}
          tokenSymbol={tokenSymbol || ''}
          closeModal={closeModal}
          modalVariant={modalVariant}
          inputError={inputError}
        />
      </div>
    </Modal>
  )
}

export default StakingModal
