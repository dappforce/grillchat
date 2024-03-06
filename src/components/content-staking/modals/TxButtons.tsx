import Button from '@/components/Button'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getCreatorsListData } from '@/services/contentStaking/creatorsList/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { isEmptyArray } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useGetMyCreatorsIds } from '../hooks/useGetMyCreatorsIds'
import { LockOrIncreaseTxWrapper } from '../mutations/lockOrIncreaseTx'
import { UnlockTxWrapper } from '../mutations/unlockTx'
import { ACTIVE_STAKING_SPACE_ID, calculateBalanceForStaking } from '../utils'
import { StakingModalVariant } from './StakeModal'

export type CommonTxButtonProps = {
  amount?: string
  spaceId: string
  decimal: number
  label: string
  tokenSymbol: string
  closeModal: () => void
  modalVariant?: StakingModalVariant
  inputError?: string
  disabled?: boolean
  eventSource?: string
  onClick?: () => void
}

type StakingTxButtonProps = CommonTxButtonProps & {
  tx: string
}

function StakingTxButton({
  amount,
  spaceId,
  decimal,
  label,
  disabled,
  tx,
  closeModal,
  onClick,
  inputError,
}: StakingTxButtonProps) {
  const myAddress = useMyMainAddress()

  const disableButton =
    !myAddress ||
    !amount ||
    (amount && new BN(amount).lte(new BN(0))) ||
    !!inputError ||
    disabled

  return (
    <LockOrIncreaseTxWrapper closeModal={closeModal}>
      {({ mutateAsync, isLoading }) => {
        return (
          <Button
            onClick={() => {
              onClick && onClick()
              mutateAsync({ spaceId, amount, decimal })
            }}
            disabled={disableButton}
            variant={'primary'}
            isLoading={isLoading}
            size={'lg'}
            className='w-full text-base'
          >
            {label}
          </Button>
        )
      }}
    </LockOrIncreaseTxWrapper>
  )
}

export function StakeOrIncreaseTxButton(props: CommonTxButtonProps) {
  const myAddress = useMyMainAddress()

  const { data: balanceByNetwork } = getBalancesQuery.useQuery({
    address: myAddress || '',
    chainName: 'subsocial',
  })

  const balanceByCurrency = balanceByNetwork?.balances?.[props.tokenSymbol]

  const availableBalance = balanceByCurrency
    ? calculateBalanceForStaking(balanceByCurrency, 'crestake')
    : new BN(0)

  return (
    <StakingTxButton
      {...props}
      disabled={availableBalance.isZero() || props.disabled}
      tx='creatorStaking.stake'
    />
  )
}

export function UnstakeTxButton(props: CommonTxButtonProps) {
  const { amount, label, inputError, disabled, closeModal } = props

  const myAddress = useMyMainAddress()
  const { data: creatorsList } = getCreatorsListData()
  const { decimal } = useGetChainDataByNetwork('subsocial') || {}

  const spaceIds = creatorsList?.map((item) => item.spaceId)
  const myCreatorsIds = useGetMyCreatorsIds(spaceIds)

  const creatorsSpaceIds =
    myCreatorsIds?.filter((id) => id !== ACTIVE_STAKING_SPACE_ID) || []

  const isOnlyActiveStaking = isEmptyArray(creatorsSpaceIds)

  const disableButton =
    !myAddress ||
    !amount ||
    (amount && new BN(amount).lte(new BN(0))) ||
    !!inputError ||
    disabled

  return (
    <UnlockTxWrapper closeModal={closeModal}>
      {({ mutateAsync, isLoading }) => {
        return (
          <Button
            onClick={() => {
              mutateAsync({
                amount,
                isOnlyActiveStaking,
                decimal: decimal || 0,
                myCreatorsIds,
                creatorsSpaceIds,
              })
            }}
            variant={'primary'}
            isLoading={isLoading}
            disabled={disableButton}
            size={'lg'}
            className='w-full text-base'
          >
            {label}
          </Button>
        )
      }}
    </UnlockTxWrapper>
  )
}
