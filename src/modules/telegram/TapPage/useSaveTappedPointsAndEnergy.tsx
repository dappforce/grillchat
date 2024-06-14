import { useSavePointsAndEnergy } from '@/services/datahub/leaderboard/points-balance/mutation'
import { increasePointsBalance } from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getClickedPointsByDayQuery,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import {
  GamificationTapEnergyState,
  GamificationTapsState,
  SynthGamificationAddTappingActivityStatesCallParsedArgs,
} from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useRef, useState } from 'react'
import {
  energyStorage,
  getEnergyStateStore,
  getTappedPointsStateStore,
  tappedPointsSavedStorage,
  tappedPointsStorage,
} from './store'

dayjs.extend(utc)

const INTERVAL_TIME = 10 * 1000

const useSaveTappedPointsAndEnergy = () => {
  const { data: clickedPointsByDayRef, isLoading: isTappedPointsLoading } =
    useGetClickedPointsByDayRef()
  const { data: energyStateRef, isLoading: isEnergyStateLoading } =
    useGetEnergyStateRef()
  const sendEvent = useSendEvent()

  const [processingPrevData, setProcessingPrevData] = useState(true)

  const myAddress = useMyMainAddress()
  const client = useQueryClient()

  const { mutateAsync: saveData } = useSavePointsAndEnergy()

  useEffect(() => {
    const updateUnprocessedData = async () => {
      if (!processingPrevData || isTappedPointsLoading || isEnergyStateLoading)
        return

      const tappedPointsStore = getTappedPointsStateStore()
      const tappedPointsSavedStore = tappedPointsSavedStorage.get()
      const energyStore = getEnergyStateStore()

      if (!tappedPointsStore && !energyStore) {
        setProcessingPrevData(false)
        return
      }

      let energyParams: GamificationTapEnergyState | undefined
      let tappedPointsParams: GamificationTapsState | undefined

      if (energyStore || energyStateRef.current) {
        const currentTimestamp = dayjs.utc().unix()

        const timestamp = energyStore?.timestamp
          ? parseInt(energyStore.timestamp)
          : energyStateRef.current?.timestamp || currentTimestamp

        const timestampDifference = currentTimestamp - timestamp

        const energyValueDuringPriod = timestampDifference / 2

        const energyValue = energyStore?.energyValue
          ? parseInt(energyStore.energyValue)
          : energyStateRef.current?.energyValue || FULL_ENERGY_VALUE

        let newEnergyValue = Math.floor(energyValue + energyValueDuringPriod)

        if (newEnergyValue > FULL_ENERGY_VALUE) {
          newEnergyValue = FULL_ENERGY_VALUE
        }

        energyParams = {
          value: newEnergyValue,
          timestamp: dayjs.utc().unix().toString(),
        }
      }

      if (tappedPointsStore) {
        const tappedPointsDifference =
          parseInt(tappedPointsStore.tappedPoints) -
          parseInt(tappedPointsSavedStore || '0')

        const newTappedPoints =
          (clickedPointsByDayRef.current?.tapsCount || 0) +
          tappedPointsDifference

        tappedPointsParams = {
          tapsCount: newTappedPoints,
        }
      }

      await updatePointsAndEnergy({
        saveData,
        params: {
          energyState: energyParams,
          tapsState: tappedPointsParams,
        },
        onSuccess: () => {
          if (energyParams) {
            energyStorage.remove()

            getEnergyStateQuery.setQueryData(client, myAddress || '', {
              energyValue: energyParams.value,
              timestamp: parseInt(energyParams.timestamp),
            })
          }

          if (tappedPointsParams && tappedPointsStore) {
            const tappedPointsDifference =
              parseInt(tappedPointsStore.tappedPoints) -
              parseInt(tappedPointsSavedStore || '0')

            sendEvent('tapped_points_saved')

            increasePointsBalance({
              pointsByClick: tappedPointsDifference,
              address: myAddress || '',
              client,
            })

            getClickedPointsByDayQuery.setQueryData(client, myAddress || '', {
              tapsCount: tappedPointsParams.tapsCount!,
              date: clickedPointsByDayRef.current?.date || '',
            })
            tappedPointsStorage.remove()
            tappedPointsSavedStorage.remove()
          }
        },
      })

      setProcessingPrevData(false)
    }

    updateUnprocessedData()
  }, [
    clickedPointsByDayRef,
    client,
    energyStateRef,
    isEnergyStateLoading,
    isTappedPointsLoading,
    myAddress,
    processingPrevData,
    saveData,
  ])

  useEffect(() => {
    if (
      isTappedPointsLoading ||
      isEnergyStateLoading ||
      !myAddress ||
      processingPrevData
    )
      return

    console.info('Start save tapped points and energy interval')
    const interval = setInterval(() => {
      const energyStore = getEnergyStateStore()
      const tappedPointsStore = getTappedPointsStateStore()
      const tappedPointsSavedStore = tappedPointsSavedStorage.get()

      if (!tappedPointsStore && !energyStore) return

      let energyParams: GamificationTapEnergyState | undefined

      if (energyStore) {
        energyParams = {
          value: parseInt(energyStore.energyValue),
          timestamp: energyStore.timestamp,
        }
      }

      let tappedPointsParams: GamificationTapsState | undefined

      if (tappedPointsStore) {
        const tappedPointsDifference =
          parseInt(tappedPointsStore.tappedPoints) -
          parseInt(tappedPointsSavedStore || '0')

        const newTappedPoints =
          (clickedPointsByDayRef.current?.tapsCount || 0) +
          tappedPointsDifference

        tappedPointsParams = {
          tapsCount: newTappedPoints,
        }
      }

      if (!tappedPointsParams && !energyParams) return

      const params: SynthGamificationAddTappingActivityStatesCallParsedArgs = {
        energyState: energyParams,
        tapsState: tappedPointsParams,
      }

      updatePointsAndEnergy({
        saveData,
        params,
        onSuccess: () => {
          // Clear tapped points and energy store
          if (energyParams) {
            energyStorage.remove()
          }

          if (tappedPointsStore && tappedPointsParams) {
            sendEvent('tapped_points_saved')
            tappedPointsSavedStorage.set(
              tappedPointsStore.tappedPoints.toString()
            )

            getClickedPointsByDayQuery.setQueryData(client, myAddress || '', {
              tapsCount: tappedPointsParams.tapsCount!,
              date: clickedPointsByDayRef.current?.date || '',
            })
          }
        },
      })
    }, INTERVAL_TIME)

    return () => {
      console.info('Clear save tapped points and energy interval')
      clearInterval(interval)
    }
  }, [
    isTappedPointsLoading,
    isEnergyStateLoading,
    myAddress,
    processingPrevData,
  ])
}

type UpdatePointsAndEnergyProps = {
  saveData: ReturnType<typeof useSavePointsAndEnergy>['mutateAsync']
  params: SynthGamificationAddTappingActivityStatesCallParsedArgs
  onSuccess?: () => void
  onError?: () => void
}

const updatePointsAndEnergy = async ({
  saveData,
  params,
  onSuccess,
  onError,
}: UpdatePointsAndEnergyProps) => {
  try {
    await saveData(params)

    console.info(
      `Tapped points - ${params.tapsState?.tapsCount} and energy - ${params.energyState?.value} saved`
    )
    onSuccess?.()
    return { sendStatus: 'success' }
  } catch (e) {
    console.error('Error saving tapped points and energy', e)
    onError?.()
    return { sendStatus: 'error' }
  }
}

const useGetClickedPointsByDayRef = () => {
  const myAddress = useMyMainAddress()
  const [loading, setLoading] = useState(true)

  const clickedPointsRef = useRef<{
    tapsCount: number
    date: string
  }>()

  const { data: clickedPointsByDay, isLoading } =
    getClickedPointsByDayQuery.useQuery(myAddress || '')

  useEffect(() => {
    clickedPointsRef.current = clickedPointsByDay

    if (!isLoading && clickedPointsByDay) setLoading(false)
  }, [clickedPointsByDay, isLoading])

  return { data: clickedPointsRef, isLoading: isLoading || loading }
}

export const useGetEnergyStateRef = () => {
  const [loading, setLoading] = useState(true)
  const myAddress = useMyMainAddress()

  const energyStateRef = useRef<{
    energyValue: number
    timestamp: number
  }>()

  const { data: energyState, isLoading } = getEnergyStateQuery.useQuery(
    myAddress || ''
  )

  useEffect(() => {
    energyStateRef.current = energyState

    if (!isLoading && energyState) setLoading(false)
  }, [energyState, isLoading])

  return { data: energyStateRef, isLoading: isLoading || loading }
}

export default useSaveTappedPointsAndEnergy
