import { createQuery } from '@/subsocial-query'
import { gql } from 'graphql-request'
import {
  GetIsActiveStakerQuery,
  GetIsActiveStakerQueryVariables,
  GetIsBalanceSufficientQuery,
  GetIsBalanceSufficientQueryVariables,
} from '../generated-query'
import { datahubQueryRequest } from '../utils'

const GET_IS_BALANCE_SUFFICIENT = gql`
  query GetIsBalanceSufficient($address: String!) {
    isBalanceSufficientForSocialAction(
      args: { address: $address, socialAction: CREATE_COMMENT }
    ) {
      sufficient
    }
  }
`
export async function getIsBalanceSufficient(
  address: string
): Promise<boolean> {
  const res = await datahubQueryRequest<
    GetIsBalanceSufficientQuery,
    GetIsBalanceSufficientQueryVariables
  >({
    document: GET_IS_BALANCE_SUFFICIENT,
    variables: { address },
  })

  return res.isBalanceSufficientForSocialAction.sufficient
}
export const getIsBalanceSufficientQuery = createQuery({
  key: 'getIsBalanceSufficient',
  fetcher: getIsBalanceSufficient,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_IS_ACTIVE_STAKER = gql`
  query GetIsActiveStaker($address: String!) {
    activeStakingIsActiveStaker(address: $address)
  }
`
export async function getIsActiveStaker(address: string): Promise<boolean> {
  const res = await datahubQueryRequest<
    GetIsActiveStakerQuery,
    GetIsActiveStakerQueryVariables
  >({
    document: GET_IS_ACTIVE_STAKER,
    variables: { address },
  })

  return res.activeStakingIsActiveStaker
}
export const getIsActiveStakerQuery = createQuery({
  key: 'getIsActiveStaker',
  fetcher: getIsActiveStaker,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
