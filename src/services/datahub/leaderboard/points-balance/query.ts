import { getMyMainAddress } from '@/stores/my-account'
import { createQuery } from '@/subsocial-query'
import { LocalStorage } from '@/utils/storage'
import { gql } from 'graphql-request'
import {
  GetBalanceQuery,
  GetBalanceQueryVariables,
} from '../../generated-query'
import { datahubQueryRequest, getDayAndWeekTimestamp } from '../../utils'

export const FULL_ENERGY_VALUE: number = 3600

const GET_BALANCE = gql`
  query GetBalance($address: String!) {
    socialProfileBalances(args: { where: { address: $address } }) {
      activeStakingPoints
    }
  }
`
// NOTE: need to be careful when changing the structure of these cached data, because it can cause the app to crash if you access unavailable data
export const getMyBalanceCache = new LocalStorage(() => 'my-balance-cache')
async function getBalance(address: string): Promise<number> {
  const res = await datahubQueryRequest<
    GetBalanceQuery,
    GetBalanceQueryVariables
  >({
    document: GET_BALANCE,
    variables: { address },
  })

  const balance =
    Number(res.socialProfileBalances?.activeStakingPoints ?? 0) || 0
  if (address === getMyMainAddress()) {
    getMyBalanceCache.set(balance + '')
  }
  return balance
}
export const getBalanceQuery = createQuery({
  key: 'getBalance',
  fetcher: getBalance,
  defaultConfigGenerator: (address) => {
    const cache =
      getMyMainAddress() === address
        ? Number(getMyBalanceCache.get())
        : undefined
    return {
      enabled: !!address,
      placeholderData: cache || undefined,
    }
  },
})

const GET_ENERGY_STATE = gql`
  query GetEnergyState($address: String!) {
    gamificationTappingEnergyState(args: { where: { address: $address } }) {
      energyValue
      timestamp
    }
  }
`

const getEnergyState = async (address: string) => {
  const res = await datahubQueryRequest<
    {
      gamificationTappingEnergyState: {
        energyValue: number
        timestamp: number
      }
    },
    { address: string }
  >({
    document: GET_ENERGY_STATE,
    variables: { address },
  })

  return {
    energyValue:
      res.gamificationTappingEnergyState?.energyValue || FULL_ENERGY_VALUE,
    timestamp: res.gamificationTappingEnergyState?.timestamp,
  }
}

export const getEnergyStateQuery = createQuery({
  key: 'getEnergyState',
  fetcher: getEnergyState,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})

const GET_CLICKED_POINTS_BY_DAYS = gql`
  query GetClickedPointsByDayS($address: String!, $dates: [Int!]!) {
    gamificationTappingActivityStatsByDate(
      args: { where: { dates: $dates, address: $address } }
    ) {
      data {
        tapsCount
        date
      }
    }
  }
`
const getClickedPointsByDays = async (address: string) => {
  const { day } = getDayAndWeekTimestamp()

  const res = await datahubQueryRequest<
    {
      gamificationTappingActivityStatsByDate: {
        data: {
          tapsCount: number
          date: string
        }[]
      }
    },
    { address: string; dates: number[] }
  >({
    document: GET_CLICKED_POINTS_BY_DAYS,
    variables: { address, dates: [day] },
  })

  const data = res.gamificationTappingActivityStatsByDate?.data || []

  return {
    tapsCount: data[0]?.tapsCount,
    date: data[0]?.date,
  }
}

export const getClickedPointsByDayQuery = createQuery({
  key: 'getClickedPointsByDay',
  fetcher: getClickedPointsByDays,
  defaultConfigGenerator: (address) => ({
    enabled: !!address,
  }),
})
