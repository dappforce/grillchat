import Toast from '@/components/Toast'
import { useSavePointsAndEnergy } from '@/services/datahub/leaderboard/points-balance/mutation'
import { increasePointsBalance } from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getClickedPointsByDayQuery,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
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
import { toast } from 'sonner'
import {
  energyStorage,
  getEnergyStateStore,
  getTappedPointsStateStore,
  tappedPointsStorage,
} from './store'

dayjs.extend(utc)

const INTERVAL_TIME = 10 * 1000

const useSaveTappedPointsAndEnergyNew = () => {
  const { data: clickedPointsByDayRef, isLoading: isTappedPointsLoading } =
    useGetClickedPointsByDayRef()
  const { data: energyStateRef, isLoading: isEnergyStateLoading } =
    useGetEnergyStateRef()

  const [processingPrevData, setProcessingPrevData] = useState(true)

  const myAddress = useMyMainAddress()
  const client = useQueryClient()

  const { mutateAsync: saveData } = useSavePointsAndEnergy()

  useEffect(() => {
    const updateUnprocessedData = async () => {
      if (!processingPrevData || isTappedPointsLoading || isEnergyStateLoading)
        return

      const tappedPointsStore = getTappedPointsStateStore()
      const energyStore = getEnergyStateStore()

      if (!tappedPointsStore && !energyStore) {
        setProcessingPrevData(false)
        return
      }

      let energyParams: GamificationTapEnergyState | undefined
      let tappedPointsParams: GamificationTapsState | undefined

      if (energyStore && energyStateRef.current?.timestamp) {
        const timestamp = energyStateRef.current.timestamp

        const currentTimestamp = dayjs.utc().unix()

        const timestampDifference = currentTimestamp - timestamp

        const energyValueDuringPriod = timestampDifference / 2

        let newEnergyValue = Math.floor(
          energyStateRef.current.energyValue + energyValueDuringPriod
        )

        if (newEnergyValue > FULL_ENERGY_VALUE) {
          newEnergyValue = FULL_ENERGY_VALUE
        }

        energyParams = {
          value: newEnergyValue,
          timestamp: dayjs.utc().unix().toString(),
        }
      }

      if (tappedPointsStore && clickedPointsByDayRef.current?.tapsCount) {
        const newTappedPoints =
          clickedPointsByDayRef.current.tapsCount +
          parseInt(tappedPointsStore.tappedPoints)

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
            increasePointsBalance({
              pointsByClick: parseInt(
                tappedPointsStore.tappedPoints!.toString()
              ),
              address: myAddress || '',
              client,
            })

            getClickedPointsByDayQuery.setQueryData(client, myAddress || '', {
              tapsCount: tappedPointsParams.tapsCount!,
              date: clickedPointsByDayRef.current?.date || '',
            })
            tappedPointsStorage.remove()
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

      if (!tappedPointsStore && !energyStore) return

      let energyParams: GamificationTapEnergyState | undefined

      if (energyStore) {
        energyParams = {
          value: parseInt(energyStore.energyValue),
          timestamp: energyStore.timestamp,
        }
      }

      let tappedPointsParams: GamificationTapsState | undefined

      if (tappedPointsStore && clickedPointsByDayRef.current?.tapsCount) {
        const newTappedPoints =
          clickedPointsByDayRef.current.tapsCount +
          parseInt(tappedPointsStore.tappedPoints)

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

          if (tappedPointsParams) {
            tappedPointsStorage.remove()

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
      `Tapped points (${params.tapsState?.tapsCount}: +${
        getTappedPointsStateStore()?.tappedPoints
      }) with balance - ${
        getTappedPointsStateStore()?.currentBalance
      } and energy (${params.energyState?.value}) saved!`
    )

    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`Tapped points (${params.tapsState?.tapsCount}: +${
            getTappedPointsStateStore()?.tappedPoints
          }) with balance - ${
            getTappedPointsStateStore()?.currentBalance
          } and energy (${params.energyState?.value}) saved!`}
        />
      ),
      { duration: 4_000 }
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

const useGetEnergyStateRef = () => {
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

export default useSaveTappedPointsAndEnergyNew
