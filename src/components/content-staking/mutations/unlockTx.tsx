import useConnectWallet from '@/hooks/useConnectWallet'
import {
  getBackerInfoBySpaceIds,
  getBackerInfoQuery,
} from '@/services/contentStaking/backerInfo/query'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import {
  generalEraInfoId,
  getGeneralEraInfoQuery,
} from '@/services/contentStaking/generalErainfo/query'
import { getStakingConstsData } from '@/services/contentStaking/stakingConsts/query'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { balanceWithDecimal, isDef } from '@subsocial/utils'
import { useQueryClient } from '@tanstack/react-query'
import { ACTIVE_STAKING_SPACE_ID } from '../utils'

type MutationProps = {
  amount?: string
  isOnlyActiveStaking: boolean
  decimal: number
  creatorsSpaceIds: string[]
  myCreatorsIds: string[]
}

export function useUnlockTx(config?: SubsocialMutationConfig<MutationProps>) {
  const currentGrillAddress = useMyMainAddress()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const { data: backerLedger } = getBackerLedgerQuery.useQuery(
    currentGrillAddress || ''
  )
  const { data: stakingConsts } = getStakingConstsData()
  const client = useQueryClient()
  const sendEvent = useSendEvent()
  useConnectWallet()

  return useSubsocialMutation(
    {
      getWallet: () =>
        getCurrentWallet(parentProxyAddress ? 'injected' : 'grill'),
      generateContext: undefined,
      transactionGenerator: async ({ data: params }) => {
        if (!currentGrillAddress) throw new Error('No address connected')

        const {
          amount,
          isOnlyActiveStaking,
          decimal,
          creatorsSpaceIds,
          myCreatorsIds,
        } = params

        if (!amount) {
          throw new Error('Amount is required')
        }

        const { locked: myTotalLock } = backerLedger || {}
        const { minimumStakingAmount } = stakingConsts || {}

        const unstakeTx = isOnlyActiveStaking
          ? await buildUnstakingParams(amount, decimal)
          : await buildBatchParams({
              myAddress: currentGrillAddress,
              amount,
              decimal,
              myTotalLock: myTotalLock || '',
              minimumStakingAmount: minimumStakingAmount || '',
              creatorsSpaceIds,
              myCreatorsIds,
            })

        return {
          tx: unstakeTx,
          summary: 'Unlock tokens',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: async ({ address, data }) => {
          await getBackerLedgerQuery.invalidate(client, address)
          await getGeneralEraInfoQuery.invalidate(client, generalEraInfoId)
          await getBalancesQuery.invalidate(client, {
            address,
            chainName: 'subsocial',
          })
          await getBackerInfoQuery.invalidate(client, {
            account: address,
            spaceIds: data.creatorsSpaceIds,
          })

          sendEvent('cs_unlock', { value: data.amount })
        },
      },
    }
  )
}

const buildUnstakingParams = async (amount?: string, decimal?: number) => {
  if (!amount || !decimal) throw new Error('Amount and decimal are required')

  const amountWithDecimals = balanceWithDecimal(amount, decimal)

  const subsocialApi = await getSubsocialApi()

  const api = await subsocialApi.substrateApi

  return api.tx.creatorStaking.unstake(
    ACTIVE_STAKING_SPACE_ID,
    amountWithDecimals.toString()
  )
}

type BatchParamsProps = {
  myAddress: string
  amount: string
  decimal: number
  myTotalLock: string
  minimumStakingAmount: string
  creatorsSpaceIds: string[]
  myCreatorsIds: string[]
}

const buildBatchParams = async ({
  myAddress,
  amount,
  decimal,
  myTotalLock,
  minimumStakingAmount,
  creatorsSpaceIds,
  myCreatorsIds,
}: BatchParamsProps) => {
  const backerInfoBySpaceIds = getBackerInfoBySpaceIds(
    myAddress || '',
    creatorsSpaceIds
  )

  if (
    !backerInfoBySpaceIds ||
    !myTotalLock ||
    !minimumStakingAmount ||
    !decimal ||
    !amount
  ) {
    throw new Error('Failed to get backer info by space ids')
  }

  const subsocialApi = await getSubsocialApi()

  const api = await subsocialApi.substrateApi

  const amountWithDecimals = balanceWithDecimal(amount, decimal)

  const spaceIds =
    myCreatorsIds?.filter((id) => id !== ACTIVE_STAKING_SPACE_ID) || []

  const txs = spaceIds.map((spaceId) => {
    const { totalStaked } = backerInfoBySpaceIds[spaceId] || {}

    if (myTotalLock <= minimumStakingAmount) {
      return api.tx.creatorStaking.unstake(
        spaceId,
        amountWithDecimals.toString()
      )
    } else {
      return api.tx.creatorStaking.moveStake(
        spaceId,
        ACTIVE_STAKING_SPACE_ID,
        totalStaked
      )
    }
  })

  const unstakingTx =
    myTotalLock <= minimumStakingAmount
      ? undefined
      : api.tx.creatorStaking.unstake(
          ACTIVE_STAKING_SPACE_ID,
          amountWithDecimals.toString()
        )

  const batchTsx = [...txs, unstakingTx].filter(isDef)

  return api.tx.utility.batch(batchTsx)
}

export const UnlockTxWrapper = createMutationWrapper(
  useUnlockTx,
  'Failed to stake or increase the stake tokens. Please try again.',
  true
)
