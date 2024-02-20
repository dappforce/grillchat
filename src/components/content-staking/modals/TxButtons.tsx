import Button from '@/components/Button'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { getCreatorsListData } from '@/services/contentStaking/creatorsList/query'
import { getGeneralEraInfoData } from '@/services/contentStaking/generalErainfo/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { isEmptyArray } from '@subsocial/utils'
import BN from 'bignumber.js'
import { useGetMyCreatorsIds } from '../hooks/useGetMyCreatorsIds'
import { LockOrIncreaseTxWrapper } from '../mutations/lockOrIncreaseTx'
import { UnlockTxWrapper } from '../mutations/unlockTx'
import { ACTIVE_STAKING_SPACE_ID, calculateBalanceForStaking } from '../utils'
import getAmountRange from '../utils/getAmountRangeForAnalytics'
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
  const { data: eraInfo } = getGeneralEraInfoData()

  const onSuccess = () => {
    // fetchBalanceByNetwork(dispatch, [ myAddress || '' ], 'subsocial')
    // fetchBackerInfo(dispatch, [ spaceId ], myAddress || '')
    // fetchGeneralEraInfo(dispatch)
    // fetchEraStakes(dispatch, [ spaceId ], eraInfo?.info?.currentEra || '0')

    // fetchEraStakes(dispatch, [ spaceId ], eraInfo?.info?.currentEra || '0')

    // fetchBackerLedger(dispatch, myAddress || '')

    closeModal()
  }

  const disableButton =
    !myAddress ||
    !amount ||
    (amount && new BN(amount).lte(new BN(0))) ||
    !!inputError ||
    disabled

  return (
    <LockOrIncreaseTxWrapper
      loadingUntilTxSuccess
      config={{
        txCallbacks: {
          onSuccess: () => {
            closeModal()
          },
        },
      }}
    >
      {({ mutateAsync, isLoading }) => {
        return (
          <Button
            onClick={() => {
              onClick && onClick()
              mutateAsync({ spaceId, amount })
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

    // <LazyTxButton
    //   network='subsocial'
    //   accountId={myAddress}
    //   tx={tx}
    //   disabled={disableButton}
    //   component={Component}
    //   onClick={onClick}
    //   params={buildParams}
    //   onFailed={showParsedErrorMessage}
    //   onSuccess={onSuccess}
    // />
  )
}

export function StakeOrIncreaseTxButton(props: CommonTxButtonProps) {
  const myAddress = useMyMainAddress()
  const sendEvent = useSendEvent()
  const { decimal } = useGetChainDataByNetwork('subsocial') || {}

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
      onClick={() =>
        sendEvent('cs_stake_increase', {
          amountRange: getAmountRange(decimal || 0, props.amount),
          eventSource: props.eventSource,
        })
      }
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
    <UnlockTxWrapper
      loadingUntilTxSuccess
      config={{
        txCallbacks: {
          onSuccess: () => {
            closeModal()
          },
        },
      }}
    >
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
