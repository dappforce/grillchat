import { useSavePointsAndEnergy } from '@/services/datahub/leaderboard/points-balance/mutation'
import { increasePointsBalance } from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getBalanceQuery,
  getClickedPointsByDayQuery,
  getEnergyStateQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  energyStorage,
  getEnergyState,
  getTappedPointsState,
  setEnergyState,
  setTappedPointsState,
  tappedPointsStorage,
} from './store'

dayjs.extend(utc)

const useSaveTappedPointsAndEnergy = () => {
  const myAddress = useMyMainAddress()
  const [processingPrevData, setProcessingPrevData] = useState(true)
  const { data: energyState } = getEnergyStateQuery.useQuery(myAddress || '')

  const { data: clickedPointsByDay } = getClickedPointsByDayQuery.useQuery(
    myAddress || ''
  )
  const client = useQueryClient()

  const clickedPointsRef = useRef<{
    tapsCount: number
    date: string
  }>()

  const energyStateRef = useRef<{
    energyValue: number
    timestamp: number
  }>()

  useEffect(() => {
    clickedPointsRef.current = clickedPointsByDay
  }, [clickedPointsByDay])

  useEffect(() => {
    energyStateRef.current = energyState
  }, [energyState])

  const { mutateAsync: saveData } = useSavePointsAndEnergy()

  const updatePointsAndEnergy = useMemo(
    () => async (newEnergyValue?: number) => {
      const tapsCountByDay = clickedPointsRef.current?.tapsCount || 0
      const tappedPoints = getTappedPointsState()
      const energyState = getEnergyState()

      if (!tappedPoints && !energyState) return {}

      const energyValue = energyState?.energyValue || '0'

      if (
        (tappedPoints?.tappedPoints === '0' ||
          tappedPoints?.sendStatus === 'success') &&
        parseInt(energyValue) === FULL_ENERGY_VALUE
      )
        return {}

      const taps = tapsCountByDay + parseInt(tappedPoints?.tappedPoints || '0')

      try {
        await saveData({
          energyState: {
            value: newEnergyValue ? newEnergyValue : parseInt(energyValue),
            timestamp: newEnergyValue
              ? dayjs.utc().unix().toString()
              : energyState?.timestamp || dayjs.utc().unix().toString(),
          },
          tapsState: {
            tapsCount: taps,
          },
        })

        getClickedPointsByDayQuery.setQueryData(client, myAddress || '', {
          tapsCount: taps,
          date: clickedPointsRef.current?.date || '',
        })

        tappedPointsStorage.remove()

        setEnergyState({
          sendStatus: 'success',
        })
        console.info(
          `Tapped points (${taps}) and energy (${energyValue}) saved!`
        )

        return { taps, sendStatus: 'success' }
      } catch (e) {
        console.error('Error saving tapped points and energy', e)

        setTappedPointsState({
          sendStatus: 'error',
        })

        setEnergyState({
          sendStatus: 'error',
        })

        return { sendStatus: 'error' }
      }
    },
    [client, myAddress, saveData]
  )

  useEffect(() => {
    const updateData = async () => {
      if (
        clickedPointsRef.current &&
        energyStateRef?.current &&
        myAddress &&
        processingPrevData
      ) {
        const tappedPoints = getTappedPointsState()

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

        if (
          (tappedPoints && tappedPoints.sendStatus !== 'success') ||
          energyStateRef.current.energyValue < FULL_ENERGY_VALUE
        ) {
          const { sendStatus, taps } = await updatePointsAndEnergy()

          if (sendStatus === 'success' && taps) {
            increasePointsBalance({
              pointsByClick: parseInt(taps.toString()),
              address: myAddress,
              client,
            })

            getClickedPointsByDayQuery.setQueryData(client, myAddress, {
              tapsCount:
                clickedPointsRef.current.tapsCount + parseInt(taps.toString()),
              date: clickedPointsRef.current.date,
            })

            getEnergyStateQuery.setQueryData(client, myAddress, {
              energyValue: newEnergyValue,
              timestamp: currentTimestamp,
            })

            await getBalanceQuery.invalidate(client, myAddress)
            await getClickedPointsByDayQuery.invalidate(client, myAddress)
            tappedPointsStorage.remove()
            energyStorage.remove()
          }
        }
        setProcessingPrevData(false)
      }
    }

    updateData()
  }, [
    clickedPointsRef.current?.tapsCount,
    energyStateRef.current?.energyValue,
    client,
    myAddress,
    processingPrevData,
    updatePointsAndEnergy,
  ])

  useEffect(() => {
    console.log(clickedPointsRef.current, processingPrevData)
    if (!clickedPointsRef.current || processingPrevData) return

    const interval = setInterval(updatePointsAndEnergy, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [processingPrevData, updatePointsAndEnergy])

  return {}
}

export default useSaveTappedPointsAndEnergy
