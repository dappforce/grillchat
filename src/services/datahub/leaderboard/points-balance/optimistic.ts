import { QueryClient } from '@tanstack/react-query'
import {
  FULL_ENERGY_VALUE,
  getBalanceQuery,
  getEnergyStateQuery,
} from './query'

type OptimisticPointsBalanceParams = {
  client: QueryClient
  address: string
  pointsByClick: number
}

export const increasePointsBalance = ({
  client,
  address,
  pointsByClick,
}: OptimisticPointsBalanceParams) => {
  getBalanceQuery.setQueryData(client, address, (oldData) => {
    if (!oldData) return oldData
    return oldData + pointsByClick
  })
}

type OptimisticEnergyParams = {
  client: QueryClient
  address: string
  energyValuePerClick: number
}

export const decreaseEnergyValue = ({
  client,
  address,
  energyValuePerClick,
}: OptimisticEnergyParams) => {
  getEnergyStateQuery.setQueryData(client, address, (oldData) => {
    if (!oldData || (oldData && oldData.energyValue === 0)) return oldData
    return {
      energyValue: oldData.energyValue - energyValuePerClick,
      timestamp: oldData.timestamp,
    }
  })
}

export const increaseEnergyValue = ({
  client,
  address,
  energyValuePerClick,
}: OptimisticEnergyParams) => {
  getEnergyStateQuery.setQueryData(client, address, (oldData) => {
    if (!oldData || (oldData && oldData.energyValue === FULL_ENERGY_VALUE))
      return oldData
    return {
      energyValue: oldData.energyValue + energyValuePerClick,
      timestamp: oldData.timestamp,
    }
  })
}
