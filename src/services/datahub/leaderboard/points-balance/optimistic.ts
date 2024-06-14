import { setEnergyStateToStore } from '@/modules/telegram/TapPage/store'
import { QueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  FULL_ENERGY_VALUE,
  getBalanceQuery,
  getEnergyStateQuery,
} from './query'

dayjs.extend(utc)

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
  let data
  getBalanceQuery.setQueryData(client, address, (oldData) => {
    data = oldData

    if (!oldData) return oldData

    data = oldData + pointsByClick
    return oldData + pointsByClick
  })

  return data
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

    setEnergyStateToStore({
      energyValue: (oldData.energyValue + energyValuePerClick).toString(),
      timestamp: dayjs.utc().unix().toString(),
    })

    return {
      energyValue: oldData.energyValue + energyValuePerClick,
      timestamp: oldData.timestamp,
    }
  })
}
